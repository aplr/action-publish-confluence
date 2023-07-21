import { beforeEach, before, afterEach, after, describe, it } from "node:test"

import { server } from "./mocks/server.mjs"

import * as confluence from "./confluence"

beforeEach(() => {
  confluence.setConfig({
    url: "https://api.confluence.test",
    accessToken: "test-token",
  })
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

describe("Confluence", () => {
  // Establish API mocking before all tests.
  before(() => server.listen())

  // Clean up after the tests are finished.
  after(() => server.close())

  describe("uploadAttachment", () => {
    it("should upload file successfully", async () => {
      await confluence.uploadAttachment(
        "123",
        "test.txt",
        Buffer.from("test"),
        "text/txt",
      )
    })
  })
})
