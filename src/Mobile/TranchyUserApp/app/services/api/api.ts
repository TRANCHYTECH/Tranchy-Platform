import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { AddQuestionResponse, ApiConfig } from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { QuestionSnapshotIn, QuestionSnapshotOut } from "app/models"

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
      },
    })
  }

  async addQuestion(
    question: QuestionSnapshotOut,
  ): Promise<{ kind: "ok"; data: QuestionSnapshotIn } | GeneralApiProblem> {
    const response: ApiResponse<AddQuestionResponse> = await this.apisauce.post(
      "/question",
      question,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // todo: parse to model in.
      return { kind: "ok", data: response }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
