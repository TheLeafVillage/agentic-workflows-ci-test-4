---
on:
  workflow_dispatch:
    inputs:
      branch:
        description: "Failing branch to fix"
        required: true
        type: string
  workflow_run:
    workflows: ["CI"]
    types: [completed]

if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'failure'

permissions:
  contents: read
  actions: read
  pull-requests: read

engine: copilot

steps:
  - name: Checkout the failing branch
    uses: actions/checkout@v7
    with:
      ref: ${{ github.event.workflow_run.head_branch || inputs.branch }}
      fetch-depth: 0
      persist-credentials: false

safe-outputs:
  create-pull-request:
    draft: false
    preserve-branch-name: true
    allowed-base-branches:
      - "**"
      - "!main"
      - "!master"

network:
  allowed:
    - defaults
---

# Fix the failing CI build on its pull request branch

Read `notes/ci-fix-guide.md` before changing any code.

Determine the failing branch before doing any work. For an automatic run, use the
triggering `workflow_run` event's `head_branch`. For a manual `workflow_dispatch`
run, use the `branch` input. The workflow has already checked out that branch on
the runner, so do not fetch or switch branches from inside the sandbox.

Reproduce the failure with:

```bash
cd app && npm test
```

Read the failing assertion carefully. Find the smallest source fix needed in
`app/src/domain.mjs`, make that fix, and avoid unrelated changes, refactors,
formatting, dependency updates, or generated-file edits. Run `cd app && npm test`
again to verify the fix.

Open the fix with the `create-pull-request` safe output as a stacked pull request:

- Set `base` to the failing branch. Never use `main` or `master` as the base.
- Set `branch` to the failing branch name with `-fix` appended.
- Keep the pull request out of draft and mention `cd app && npm test` in its body.

The pull request must target the failing branch, never `main`, so the fix stacks
cleanly on the branch whose CI run failed.