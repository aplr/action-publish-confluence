import { readFile, stat } from "fs/promises"

import * as core from "@actions/core"
import * as utils from "@google-github-actions/actions-utils"

import * as confluence from "./confluence"
import { getConfig } from "./config"

// Do not listen to the linter - this can NOT be rewritten as an ES6 import statement.
// eslint-disable-next-line import/no-commonjs,@typescript-eslint/no-var-requires
const { version: appVersion } = require("../package.json")

async function syncAttachments(
  pageId: string,
  attachments: Record<string, string>,
): Promise<void> {
  if (Object.keys(attachments).length === 0) {
    core.info("No attachments to publish")
    return
  }

  for (const [_, path] of Object.entries(attachments)) {
    // check if files exist
    await stat(path)
  }

  const remoteAttachments = await confluence.getAttachments(pageId)

  const remoteAttachmentsMap = Object.fromEntries(
    remoteAttachments.results.map(attachment => [attachment.title, attachment]),
  )

  for (const [filename, path] of Object.entries(attachments)) {
    const data = await readFile(path)

    // get remote attachment if exists
    const remoteAttachment = remoteAttachmentsMap[filename]

    // upload the attachment
    await confluence.uploadAttachment(pageId, filename, data, remoteAttachment?.id)

    if (remoteAttachment) {
      core.info(`Updated ${filename} on page ${pageId}.`)
    } else {
      core.info(`Added ${filename} to page ${pageId}.`)
    }
  }
}

async function run(): Promise<void> {
  core.exportVariable("APLR_CONFLUENCE_METRICS_ENVIRONMENT_VERSION", appVersion)

  try {
    const { url, username, accessToken, attachments, pageId } = await getConfig()

    confluence.setConfig({
      url,
      username,
      accessToken,
    })

    await syncAttachments(pageId, attachments)
  } catch (err) {
    const msg = utils.errorMessage(err)
    core.setFailed(`aplr/actions-gcloud-compute-instance failed with ${msg}`)
  }
}

if (require.main === module) {
  run()
}