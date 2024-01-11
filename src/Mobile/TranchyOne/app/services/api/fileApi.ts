import { FileSystemUploadType, uploadAsync } from "expo-file-system"
import { api } from "./api"
import { GeneralApiProblem } from "./apiProblem"
import { UploadFileResponse } from "../ask-api/models"

export interface UploadFileRequest {
  questionId: string
  fileName: string
  fileUri: string
}

export const uploadFile = async (
  request: UploadFileRequest,
): Promise<{ kind: "ok"; data: UploadFileResponse } | GeneralApiProblem> => {
  try {
    const response = await uploadAsync(
      `${api.apisauce.getBaseURL()}questions/${request.questionId}/files?fileName=${
        request.fileName
      }`,
      request.fileUri,
      {
        headers: {
          authorization: api.apisauce.headers.Authorization,
          "x-csrf": "1",
        },
        httpMethod: "POST",
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: "file",
      },
    )

    if (response.status !== 200) {
      return { kind: "server" }
    }

    return { kind: "ok", data: JSON.parse(response.body) }
  } catch (error) {
    // todo(tranchy): log for insight.
    if (__DEV__) {
      console.tron.debug("unknown error during uploading file " + JSON.stringify(error))
    }

    // Alert.alert(`Không thể upload file. error:` + JSON.stringify(error))
    return { kind: "unknown", temporary: true }
  }
}
