// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestError } from "../../entities/error";
import {
  GetResourcesRequest,
  GetResourcesResponse,
} from "../../entities/resource";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestError | GetResourcesResponse>
) {
  try {
    if (req.method === "GET") {
      const { limit } = req.query as unknown as GetResourcesRequest;
      if (!parseInt(limit))
        throw new Error(`Request parameter Limit is invalid: ${limit}`);

      return res.status(200).json({ resources: [] });
    }
  } catch (error) {
    const e = error as Error;
    return res
      .status(500)
      .json({ message: JSON.stringify(e.message, null, 2) });
  }

  // Fallthrough
  return res.status(404).json({ message: "Not found" });
}
