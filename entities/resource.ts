export interface Resource {
  id: string;
  text: string;
}

export interface GetResourcesRequest {
  limit: string;
}

export interface GetResourcesResponse {
  resources: Resource[];
}
