export interface RequestError {
  info: string;
  status?: number;
  errors?: { message: string }[];
}
