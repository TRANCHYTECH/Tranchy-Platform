import { SupportLevel } from "app/models"

export interface AddQuestionResponse {
  content: string
  categories: string[]
  supportLevel: SupportLevel
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
