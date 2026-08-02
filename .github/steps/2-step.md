## Step 2: Create the build-fixing workflow

Nice work getting agentic workflows ready. Now it is time to teach Mona's repository how to react when the **CI** workflow fails on a pull request branch.

### 📖 Theory: Agentic workflows as CI teammates

An agentic workflow can inspect a failing run, read repository notes, reproduce a failure locally, make a small code change, and open a pull request for human review. In this workshop, the fixer opens a **stacked pull request** against the branch that failed CI, so the original pull request can go green before it merges to `main`.

In this step, you'll prompt the **agentic-workflows** Copilot agent to create `.github/workflows/autofix-ci.md`, compile it with `gh aw`, and merge the setup pull request.

### :keyboard: Activity: Create the build fixer workflow

Continue working in VS Code. If you closed your browser editor, reopen your development environment from your repository's **Code** menu.

1. In the new ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **terminal window**, use the keyboard shortcut `Ctrl + I` (Windows) or `Cmd + I` (Mac) to bring up **Copilot's Terminal Inline Chat**.

2. Ask Copilot to create a branch for the workflow work.

   > ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=social&logo=github%20copilot)
   >
   > ```prompt
   > Hey copilot,
   > - Make sure I am on the latest main branch.
   > - Create a new branch named create-build-fixer-workflow.
   > ```

   > 💡 **Tip:** If Copilot does not give you quite what you want, you can keep explaining what you need. Copilot will remember the conversation history for follow-up responses.

3. Open the **Copilot Chat panel** using `Ctrl + Alt + I` (Windows) or `Ctrl + Cmd + I` (Mac). Select the **agentic-workflows** agent from the agent selector and give it access to edit files in the repository.

> [!NOTE]
> The agentic-workflows agent is a general-purpose agent that can follow instructions in markdown files. You will use it to draft the workflow definition, then you will compile the workflow yourself.

   <!-- TODO screenshot: Select the agentic-workflows agent in Copilot Chat. -->

4. Before prompting the agent, add a rule to `.github/agents/agentic-workflows.md` so the agent knows not to compile workflows on its own. Open the file and add the following line under Important Notes:

   ```markdown
   When creating or editing agentic workflow files, do not compile them. Only create or update the markdown workflow file.
   ```

5. Ask the agentic-workflows agent to create the build fixer workflow file.

   > ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=social&logo=github%20copilot)
   >
   > ```prompt
   > Create .github/workflows/autofix-ci.md as an agentic workflow markdown file.
   >
   > Requirements:
   > - Use the Copilot engine.
   > - Trigger on workflow_dispatch and on workflow_run for the CI workflow when a run completes with conclusion failure.
   > - Do not scope the workflow_run trigger to main; it must react to CI failures on pull request branches.
   > - Use safe-outputs with create-pull-request, set draft false, preserve the branch name, and with allowed-base-branches allow any feature branch as a base while excluding the protected branches main and master.
   > - Declare network access with the default allowlist.
   > - Tell the agent to read notes/ci-fix-guide.md before changing code.
   > - Tell the agent to determine the failing branch from the workflow_run head_branch on automatic runs, or from the workflow_dispatch branch input on manual runs.
   > - Add a steps: block to the workflow that checks out the failing branch on the runner before the agent runs. Use actions/checkout with fetch-depth 0, persist-credentials false, and ref set to the workflow_run head_branch, falling back to the workflow_dispatch branch input. This is required because the default checkout is healthy main, and the agent cannot fetch the branch itself from inside its sandbox.
   > - Tell the agent to reproduce the failure with cd app && npm test.
   > - Tell the agent to read the assertion, find the smallest needed source fix in app/src/domain.mjs, and avoid unrelated changes.
   > - Tell the agent to open the fix as a stacked pull request whose base is the failing branch, never main, and name the fix branch by adding -fix to the failing branch.
   > - Check that the markdown workflow syntax is valid.
   > - Do not compile the workflow.
   > ```

### :keyboard: Activity: Review and compile the `autofix-ci.md` Agentic Workflow

1. Review `.github/workflows/autofix-ci.md`. It should look similar to this reference:

   ````markdown
   ---
   on:
     workflow_dispatch:
       inputs:
         branch:
           description: "Failing branch to fix (used only for manual runs)"
           required: false
           default: "introduce-bug"
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
     # Check out the branch whose CI failed, on the runner, before the agent starts.
     - name: Checkout the failing branch
       uses: actions/checkout@v5
       with:
         ref: FAILING_BRANCH   # runtime expression — see the note under this sample
         fetch-depth: 0
         persist-credentials: false
   safe-outputs:
     create-pull-request:
       draft: false
       allowed-base-branches:
         - "**"
         - "!main"
         - "!master"
       preserve-branch-name: true
   network:
     allowed:
       - defaults
   ---

   # Fix Mona's failing CI build on the pull request branch

   You are helping maintain Mona's Issue Triage API. The **CI** workflow just failed.
   Diagnose the failure and open a pull request that fixes it **on the branch that
   failed**, not on `main`.

   Read `notes/ci-fix-guide.md` before making changes.

   Determine the branch whose CI run failed. On an automatic run, use the triggering
   `workflow_run` event's `head_branch` (for example `introduce-bug`). On a manual run,
   use the `branch` input. This is the branch you will target as the base of your fix.

   The workflow's `steps:` block has **already checked out this failing branch for you**,
   so the buggy code is right there in your workspace — you do not need to fetch or
   switch branches. Confirm where you are, then reproduce the failure:

   ```bash
   git status
   cd app && npm test
   ```

   Read the assertion message, identify the function in `app/src/domain.mjs` that must
   change, and make the smallest fix that turns the tests green. Avoid unrelated
   refactors, formatting-only changes, dependency updates, and edits outside
   `app/src/domain.mjs` unless the failing test proves they are needed.

   Run `cd app && npm test` again to confirm the fix.

   Open a pull request with `safe-outputs` `create-pull-request`:
   - Set the pull request **base** to the failing branch you identified, so your fix
     stacks on top of that branch instead of `main`.
   - Name your fix branch after the failing branch with a `-fix` suffix, for example
     `introduce-bug-fix`.
   - Keep the description friendly and mention the test command you ran.

   Never push directly to `main` and never target `main` as the base branch.
   ````

   > [!NOTE]
   > In the reference above, the checkout `ref` is shown as the placeholder `FAILING_BRANCH`. In your generated file it is a real GitHub Actions runtime expression that reads the `workflow_run` head branch on automatic runs and falls back to the manual `branch` input — for example the value of `github.event.workflow_run.head_branch`. Keep `persist-credentials: false`; the workflow will not compile without it.

   > [!IMPORTANT]
   > `allowed-base-branches` is a safety guardrail: it limits which branches the fixer is allowed to target. The `**` pattern lets it stack a fix onto whatever feature branch failed CI, while `!main` and `!master` stop it from ever opening a fix straight against your protected trunk. In your own repositories you can tighten `**` to match your branch naming convention if you want a narrower blast radius.

2. Compile the agentic workflow in the ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **terminal window**.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > gh aw compile autofix-ci
   > ```

   The compile command should create `.github/workflows/autofix-ci.lock.yml`.

3. Make sure the workflow files include these important pieces:

   - `.github/workflows/autofix-ci.md` exists.
   - `.github/workflows/autofix-ci.lock.yml` exists.
   - `autofix-ci.md` includes `workflow_dispatch`, `workflow_run`, `CI`, `conclusion`, `safe-outputs`, `create-pull-request`, `allowed-base-branches`, `network`, `steps`, `persist-credentials`, and `notes/ci-fix-guide.md`.
   - `autofix-ci.lock.yml` references `COPILOT_GITHUB_TOKEN`.
   - `.github/agents/agentic-workflows.md` includes the no auto-compile rule from this step.

4. In the ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **terminal window**, commit and push the generated files yourself. `git add -A` stages both the setup files from Step 1 and the new fixer workflow.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git add -A
   > git commit -m "Create Mona build fixer workflow"
   > git push -u origin create-build-fixer-workflow
   > ```

   Then open a pull request from `create-build-fixer-workflow` into `main` with the title `Create Mona build fixer workflow`.

5. Merge the pull request into `main`. Wait about 20 seconds, then refresh the exercise issue for the next step.

<details>
<summary>Having trouble? 🤷</summary><br/>

- The grading check looks for `.github/workflows/autofix-ci.md` and `.github/workflows/autofix-ci.lock.yml`.
- Include the phrases `safe-outputs`, `create-pull-request`, `workflow_run`, `workflow_dispatch`, `network`, `CI`, `conclusion`, `allowed-base-branches`, `steps`, `persist-credentials`, and `notes/ci-fix-guide.md` in `.github/workflows/autofix-ci.md`.
- Confirm `allowed-base-branches` allows feature branches (for example with `**`) but excludes `main`, so the fixer creates a stacked pull request against the failing branch instead of the trunk.
- Make sure the workflow has a `steps:` block that checks out the failing branch (from the `workflow_run` `head_branch`, or the manual `branch` input) with `persist-credentials: false`. Without it the fixer runs against healthy `main`, can't reproduce the bug, and its pull request ends up empty or conflicting.
- Include the no auto-compile rule in `.github/agents/agentic-workflows.md`: `Only create or update the markdown workflow file.`
- If `gh aw compile autofix-ci` fails, compare your frontmatter with the reference above and try compiling again.

</details>
