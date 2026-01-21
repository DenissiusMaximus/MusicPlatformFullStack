import type {
  GetUserGraphqlResponse,
  IsUsernameAvailableGraphqlResponse,
  LoginGraphqlResponse, LoginInput, RegisterGraphqlResponse, RegisterInput
} from "../types.ts";
import {axiosGraph} from "../utils/axios.ts";
import {GET_USER_BY_ID_QUERY, IS_USERNAME_AVAILABLE_QUERY, LOGIN_MUTATION, REGISTER_MUTATION} from "../Queries.ts";

export class AuthRepository {
  async login(input: LoginInput){
    return await axiosGraph<LoginGraphqlResponse>(LOGIN_MUTATION, input);
  }

  async register(input: RegisterInput){
    return await axiosGraph<RegisterGraphqlResponse>(REGISTER_MUTATION, input);
  }

  async isUsernameAvailable(input: string){
    return await axiosGraph<IsUsernameAvailableGraphqlResponse>(IS_USERNAME_AVAILABLE_QUERY, {username: input});
  }

  async getUserById(input: number){
    return await axiosGraph<GetUserGraphqlResponse>(GET_USER_BY_ID_QUERY, {id: input});
  }
}

export default new AuthRepository();