import axios from "axios";
import type {GraphQLResponse} from "../types.ts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GRAPHQL_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("_t");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const axiosGraph = async <T>(
    query: string,
    variables?: Record<string, any>
): Promise<T> => {
  try {
    const response = await axiosInstance.post<GraphQLResponse<T>>("", {
      query,
      variables,
    });

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(
          response.data.errors[0].message || "GraphQL error"
      );
    }

    return response.data.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.request) {
        if (err.code === "ERR_NETWORK") {
          throw new Error();
        }
      }

      if (err instanceof Error) throw err;
    }

    throw new Error(err.message);
  }
};

export default axiosInstance;
