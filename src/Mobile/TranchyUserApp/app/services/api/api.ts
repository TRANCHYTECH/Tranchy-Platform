import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { CreateQuestionResponse, ApiConfig } from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { QuestionSnapshotIn, QuestionSnapshotOut } from "app/models"
import * as FileSystem from "expo-file-system"

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

  async addQuestion(
    question: QuestionSnapshotOut,
  ): Promise<{ kind: "ok"; data: QuestionSnapshotIn } | GeneralApiProblem> {
    const response: ApiResponse<CreateQuestionResponse> = await this.apisauce.post(
      "question",
      question,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", data: { id: response.data.id } }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async uploadFile(
    questionId: string,
    fileName: string,
    fileUri: string,
  ): Promise<{ kind: "ok"; data: { questionId: string } } | GeneralApiProblem> {
    try {
      const response = await FileSystem.uploadAsync(
        `${api.apisauce.getBaseURL()}file/question/${questionId}?fileName=${fileName}`,
        fileUri,
        {
          headers: { authorization: api.apisauce.headers.Authorization, "x-csrf": "1" },
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
        },
      )

      if (response.status !== 200) {
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
