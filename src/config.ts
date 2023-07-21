import zod from "zod"

import * as core from "@actions/core"

// A regex that accepts a list of string=string pairs, separated by either commas or newlines.
const keyValueRegex = /^((?:\s*[\w-.+]+\s*=\s*.+\s*(?:,|\n)?)+)$/

const parseKeyValuePairs = (value: string): Record<string, string> =>
  Object.fromEntries(
    value.split(/,|\n/).map(p =>
      p
        .trim()
        .split("=")
        .map(v => v.trim()),
    ),
  )

const configSchema = zod.object({
  url: zod.string().url(),
  username: zod.string().optional(),
  password: zod.string().optional(),
  accessToken: zod.string().optional(),
  pageId: zod.string(),
  attachments: zod.string().regex(keyValueRegex).transform(parseKeyValuePairs),
})

type ConfigInput = zod.input<typeof configSchema>
export type Config = zod.infer<typeof configSchema>

export async function getConfig(): Promise<Config> {
  const config = Object.fromEntries(
    Object.entries(getActionInputs()).filter(([_, v]) => v !== undefined),
  )

  return await configSchema.parseAsync(config)
}

function getActionInputs(): ConfigInput {
  return {
    url: core.getInput("url", { required: true }),
    username: core.getInput("username", { required: false }),
    password: core.getInput("password", { required: false }),
    accessToken: core.getInput("access_token", { required: false }),
    pageId: core.getInput("page_id", { required: true }),
    attachments: core.getInput("attachments", { required: false }),
  }
}
