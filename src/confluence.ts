import { File, FormData, fetch, RequestInit, Response } from "undici"

export interface Config {
  url: string
  username: string
  accessToken: string
}

let _config: Config = {
  url: "",
  username: "",
  accessToken: "",
}

export const setConfig = (config: Config): void => {
  _config = config
}

export const uploadAttachment = async (
  pageId: string,
  filename: string,
  filedata: Buffer,
  attachmentId?: string,
): Promise<PaginatedResponse<Attachment>> => {
  const formData = new FormData()
  const file = new File([filedata], filename)
  formData.set("file", file, filename)

  const path = attachmentId
    ? `content/${pageId}/child/attachment/${attachmentId}/data`
    : `content/${pageId}/child/attachment`

  const response = await req(path, {
    method: "POST",
    headers: {
      "X-Atlassian-Token": "no-check",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })

  const data = await response.json()

  return data as PaginatedResponse<Attachment>
}

export const getAttachments = async (
  pageId: string,
): Promise<PaginatedResponse<Attachment>> => {
  const response = await req(`content/${pageId}/child/attachment`)

  const data = await response.json()

  return data as PaginatedResponse<Attachment>
}

const req = async (path: string, init?: RequestInit): Promise<Response> => {
  const { username, accessToken } = _config
  const auth = Buffer.from([username, accessToken].join(":")).toString("base64")

  const { headers = {}, ...options } = init || {}

  return await fetch(`${_config.url}/rest/api/${path}`, {
    headers: {
      Authorization: `Basic ${auth}`,
      ...headers,
    },
    ...options,
  })
}

export interface Attachment {
  id: string
  type: string
  status: string
  title: string
  metadata: Record<string, string>
}

export interface PaginatedResponse<T> {
  results: T[]
  size: number
}
