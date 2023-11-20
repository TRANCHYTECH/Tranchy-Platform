/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type {
  CreateQuestionEventBody,
  CreateQuestionRequest,
  CreateQuestionResponse,
  GetQuestionConfigurationsResponse,
  Question,
  QuestionOutput,
  UploadFileForQuestionBody,
  UploadFileForQuestionParams,
  UploadQuestionFileResponse,
} from "./models"
import { apiRequest } from "../api/api"

export const createQuestion = (createQuestionRequest: CreateQuestionRequest) => {
  return apiRequest<CreateQuestionResponse>({
    url: `/question`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: createQuestionRequest,
  })
}

export const createQuestionEvent = (
  questionId: string,
  createQuestionEventBody: CreateQuestionEventBody,
) => {
  return apiRequest<QuestionOutput>({
    url: `/question/${questionId}/Event`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: createQuestionEventBody,
  })
}

export const getQuestionConfigurations = () => {
  return apiRequest<GetQuestionConfigurationsResponse>({
    url: `/question/configurations`,
    method: "get",
  })
}

export const getQuestionById = (id: string) => {
  return apiRequest<QuestionOutput>({ url: `/question/${id}`, method: "get" })
}

export const getQuestionByUser = (user: string) => {
  return apiRequest<QuestionOutput>({ url: `/question/user/${user}`, method: "get" })
}

export const pickQuestion = (id: string) => {
  return apiRequest<void>({ url: `/question/${id}/pick`, method: "post" })
}

export const listCommunityQuestions = () => {
  return apiRequest<Question[]>({ url: `/question/list/community`, method: "get" })
}

export const listMyQuestions = () => {
  return apiRequest<Question[]>({ url: `/question/list/mine`, method: "get" })
}

export const seedMetadata = () => {
  return apiRequest<void>({ url: `/question/suportdeveloper/seedmetadata`, method: "post" })
}

export const getAgencyPortal = () => {
  return apiRequest<void>({ url: `/agency-portal`, method: "get" })
}

export const uploadFileForQuestion = (
  questionId: string,
  uploadFileForQuestionBody: UploadFileForQuestionBody,
  params: UploadFileForQuestionParams,
) => {
  const formData = new FormData()
  formData.append("file", uploadFileForQuestionBody.file)

  return apiRequest<UploadQuestionFileResponse>({
    url: `/file/question/${questionId}`,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  })
}

export const acceptQuestion = (id: string) => {
  return apiRequest<void>({ url: `/question/${id}/accept`, method: "post" })
}

export type CreateQuestionResult = NonNullable<Awaited<ReturnType<typeof createQuestion>>>
export type CreateQuestionEventResult = NonNullable<Awaited<ReturnType<typeof createQuestionEvent>>>
export type GetQuestionConfigurationsResult = NonNullable<
  Awaited<ReturnType<typeof getQuestionConfigurations>>
>
export type GetQuestionByIdResult = NonNullable<Awaited<ReturnType<typeof getQuestionById>>>
export type GetQuestionByUserResult = NonNullable<Awaited<ReturnType<typeof getQuestionByUser>>>
export type PickQuestionResult = NonNullable<Awaited<ReturnType<typeof pickQuestion>>>
export type ListCommunityQuestionsResult = NonNullable<
  Awaited<ReturnType<typeof listCommunityQuestions>>
>
export type ListMyQuestionsResult = NonNullable<Awaited<ReturnType<typeof listMyQuestions>>>
export type SeedMetadataResult = NonNullable<Awaited<ReturnType<typeof seedMetadata>>>
export type GetAgencyPortalResult = NonNullable<Awaited<ReturnType<typeof getAgencyPortal>>>
export type UploadFileForQuestionResult = NonNullable<
  Awaited<ReturnType<typeof uploadFileForQuestion>>
>
export type AcceptQuestionResult = NonNullable<Awaited<ReturnType<typeof acceptQuestion>>>
