// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestError } from "../../entities/error";
import {
  GetResourcesRequest,
  GetResourcesResponse,
} from "../../entities/resource";

import memoryClient from "../../repository/memory/client";
import { getResources as getResourcesFromMemory } from "../../repository/memory/resource";

import dbClient from "../../repository/db/prisma/prisma";
import { getResources as getResourcesFromDB } from "../../repository/db/resource";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestError | GetResourcesResponse>
) {
  try {
    if (req.method === "GET") {
      // Parse any parameters from the query
      const { limit, repo } = req.query as unknown as GetResourcesRequest;

      // Check if the request is correct
      if (!parseInt(limit))
        throw new Error(`Request parameter Limit is invalid: ${limit}`);

      if (repo !== "db" && repo !== "memory")
        throw new Error(
          `Request parameter Repo ("db" or "memory") is invalid: ${repo}`
        );

      // Query the repository and transform the response data into the right format
      if (repo === "memory") {
        const response: GetResourcesResponse = {
          resources: getResourcesFromMemory(memoryClient, parseInt(limit)).map(
            (r) => ({
              id: r.id,
              text: r.text,
            })
          ),
        };
        return res.status(200).json(response);
      }

      if (repo === "db") {
        const resFromDB = await getResourcesFromDB(dbClient, parseInt(limit));

        const response: GetResourcesResponse = {
          resources: resFromDB.map((r) => ({
            id: r.id,
            text: r.text,
          })),
        };
        return res.status(200).json(response);
      }
    }
  } catch (error) {
    const e = error as Error;
    return res.status(500).json({ info: JSON.stringify(e.message, null, 2) });
  }

  // Fallthrough if request is not handled
  return res.status(404).json({ info: "Not found" });
}
