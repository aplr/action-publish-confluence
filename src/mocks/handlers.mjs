import { rest } from "msw"

export const handlers = [
  rest.post(
    "https://api.confluence.test/rest/api/content/:pageId/child/attachment",
    req => {
      console.log(req)
    },
  ),
]
