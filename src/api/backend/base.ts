import { ofetch } from "ofetch";

export type BaseRequest<T> = {
  results: T[];
};

export const client = ofetch.create({
  baseURL: "https://backend.bookracy.org/api",
});
