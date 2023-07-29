# action-publish-confluence

The `action-publish-confluence` GitHub Action allows you to publish content and attachments to a Confluence page.

> Currently, this action can only publish to self-hosted Confluence Data Center instances.
> Support for Confluence Cloud can be easily added in the future.

> Currently, this action can only publish to existing Confluence pages. Support for
> creating new pages can be easily added in the future.

## Use Cases

Each time assets are produced by a CI/CD pipeline, which should be available on Confluence, this action comes in handy. Use cases include, among others:

- Publish documentation to Confluence
- Publish release notes to Confluence
- Publish build artifacts to Confluence

## Prerequisites

- This action requires either a [Confluence Access Token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) or a username and password combination. The credentials must have sufficient permissions and access rights to publish to the given confluence page.

- The Confluence page must exist and be accessible by the credentials. The page can be empty or contain content. The action will overwrite the page content with the given content.

- This action runs using Node 16. If you are using self-hosted GitHub Actions runners, you must use runner version [2.285.0](https://github.com/actions/virtual-environments) or newer.

## Usage

```yaml
jobs:
  job_id:
    steps:
      - name: Checkout
        uses: "actions/checkout@v3"

      - name: Typst
        run: typst compile docs.typ

      - name: Publish Confluence
        uses: "aplr/action-publish-confluence@main"
        with:
          url: "${{ vars.CONFLUENCE_URL }}"
          access_token: "${{ secrets.CONFLUENCE_ACCESS_TOKEN }}"
          page_id: "${{ vars.CONFLUENCE_PAGE_ID }}"
          attachments: |
            docs.pdf=./docs.pdf
```

## Inputs

- `url`: (Required) The url of the Confluence instance to publish to.

- `access_token`: (Optional) The access token to use for authentication. If omitted, the `username` and `password` inputs are required.

- `username`: (Optional) The username to use for authentication. If omitted, the `access_token` input is required.

- `password`: (Optional) The password to use for authentication. If omitted, the `access_token` input is required.

- `page_id`: (Required) The ID of the page to publish to.

- `attachments`: (Optional) A list of attachments to publish to the page. The format is `name=path`, where `name` is the name of the attachment in Confluence, and `path` is the path to the attachment file. The path must be relative to the repository root.
