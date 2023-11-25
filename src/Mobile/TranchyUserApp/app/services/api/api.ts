import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { AxiosRequestConfig } from "axios"
import { FileSystemUploadType, uploadAsync } from "expo-file-system"
import Config from "../../config"
import { ApiConfig } from "./api.types"
import { GeneralApiProblem } from "./apiProblem"

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

  async uploadFile(
    questionId: string,
    fileName: string,
    fileUri: string,
  ): Promise<{ kind: "ok"; data: { questionId: string } } | GeneralApiProblem> {
    try {
      const response = await uploadAsync(
        `${api.apisauce.getBaseURL()}file/question/${questionId}?fileName=${fileName}`,
        fileUri,
        {
          headers: { authorization: api.apisauce.headers.Authorization, "x-csrf": "1" },
          httpMethod: "POST",
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: "file",
        },
      )

      if (response.status !== 200) {
        console.tron.error("Could not upload file", response.body)
        return { kind: "server" }
      }

      try {
        const data = JSON.parse(response.body)
        return { kind: "ok", data: { questionId: data.questionId } }
      } catch (e) {
        if (__DEV__) {
          console.tron.error(`Bad data: ${e.message}\n${response.body}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    } catch (ex) {
      console.error("Could not upload", ex)
      return { kind: "server" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()

export const apiRequest = <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return api.apisauce.any(config)
}
