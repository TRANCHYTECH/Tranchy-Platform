import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { AxiosRequestConfig } from "axios"
import Config from "../../config"
import { ApiConfig } from "./api.types"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "x-csrf": "1",
      },
    })
  }
}

// Singleton instance of the API for convenience
export const api = new Api()

export const apiRequest = <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return api.apisauce.any(config)
}
