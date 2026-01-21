import {axiosGraph} from "../utils/axios.ts";
import type {SearchGraphqlResponse} from "../types.ts";
import {SEARCH_QUERY} from "../Queries.ts";

export class SearchRepository {
  async search(input: string){
    return await axiosGraph<SearchGraphqlResponse> (SEARCH_QUERY, {query: input});
  }
}

export default new SearchRepository();