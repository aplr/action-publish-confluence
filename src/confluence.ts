import { File, FormData, fetch, RequestInit, Response } from "undici"

export interface ConfluenceConfig {
  url: string
  username?: string
  password?: string
  accessToken?: string
}

let _config: ConfluenceConfig = {
  url: "",
}

export const setConfig = (config: ConfluenceConfig): void => {
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

const getAuthHeader = () => {
  const { username, password, accessToken } = _config

  if (accessToken) {
    return `Bearer ${accessToken}`
  } else if (username && password) {
    const credentials = Buffer.from([username, password].join(":")).toString("base64")
    return `Basic ${credentials}`
  }

  throw new Error("No credentials provided")
}

const req = async (path: string, init?: RequestInit): Promise<Response> => {
  const auth = getAuthHeader()

  const { headers = {}, ...options } = init || {}

  return await fetch(`${_config.url}/rest/api/${path}`, {
    headers: {
      Authorization: auth,
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
