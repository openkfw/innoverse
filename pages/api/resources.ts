// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestError } from "../../entities/error";
import {
  GetResourcesRequest,
  GetResourcesResponse,
} from "../../entities/resource";
import { getResources } from "../../repository/inmemory";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestError | GetResourcesResponse>
) {
  try {
    if (req.method === "GET") {
      // Parse any parameters from the query
      const { limit } = req.query as unknown as GetResourcesRequest;

      // Check if the request is correct
      if (!parseInt(limit))
        throw new Error(`Request parameter Limit is invalid: ${limit}`);

      // Query the repository and transform the response data into the right format
      const response: GetResourcesResponse = {
        resources: getResources(parseInt(limit)).map((r) => ({
          id: r.id,
          text: r.text,
        })),
      };

      // Answer the request
      return res.status(200).json(response);
    }
  } catch (error) {
    const e = error as Error;
    return res.status(500).json({ info: JSON.stringify(e.message, null, 2) });
  }

  // Fallthrough if request is not handled
  return res.status(404).json({ info: "Not found" });
}
