## Step 4: Review Mona's CI fix and confirm the build is green

The fixer agentic workflow has diagnosed the failing test and opened a stacked pull request with a proposed source fix. In this final step, you'll review that generated change, merge it into `introduce-bug`, confirm the original bug pull request turns green, and then merge the original pull request into `main`.

### 📖 Theory: Human review for self-healing CI

Self-healing CI should still keep people in control. The agent can reproduce the failure, reason about the test output, and propose a minimal patch, but `safe-outputs: create-pull-request` keeps the change in a pull request for review before it reaches the failing branch or `main`.

Merging the fixer's stacked pull request updates the still-open bug pull request. That re-runs **CI** on the bug pull request so you can validate the fix before merging the original bug pull request into `main`. Merging the original bug pull request into `main` triggers the final grading workflow, which runs `npm ci && npm test` in `app/` on `main`, confirms the build is green, and then completes the exercise.

### :keyboard: Activity: Review the stacked fix and merge the green bug pull request

1. Open the **Pull requests** tab in your repository.

2. Find the stacked pull request opened by the fixer agentic workflow. It should target the `introduce-bug` branch, not `main`, and its title should mention fixing the build, CI, or Mona's Issue Triage API.

3. Open the pull request and review the **Files changed** tab.

   Confirm the diff updates `app/src/domain.mjs` and corrects the helper that caused the failing test. The fix should be small and focused.

   <!-- TODO screenshot: fixer pull request Files changed tab showing app/src/domain.mjs -->

4. Review the stacked pull request carefully, then merge it into `introduce-bug`.

   This stacked pull request does **not** have CI checks of its own because it targets the feature branch, and the **CI** workflow only runs for pull requests into `main`. Review the diff and merge on review; validation happens when the original bug pull request re-runs.

   The sample sets `draft: false`, so the fixer pull request should be directly mergeable. If your fixer produced a draft pull request anyway, click **Ready for review** before merging.

5. Return to the original bug pull request into `main`.

   After the stacked fix merges into `introduce-bug`, GitHub synchronizes the original pull request and re-runs **CI**. Wait for that **CI** run to go green.

6. Merge the original bug pull request into `main`.

7. Open the **Actions** tab and select the **CI** workflow. Confirm the latest run on `main` is green.

8. Wait about 20 seconds, then refresh the exercise issue for the final review.

<details>
<summary>Having trouble? 🤷</summary><br/>

- If no fixer pull request appears, open the **Actions** tab and check the `autofix-ci` workflow run. Confirm `COPILOT_GITHUB_TOKEN` is configured, and confirm **Allow GitHub Actions to create and approve pull requests** is enabled in the repository's Actions settings.
- If the fixer did not run automatically, use the **Run workflow** button on the `autofix-ci` workflow as a safety valve.
- If the fixer pull request targets the wrong base branch, confirm `allowed-base-branches` allows `introduce-bug*` and confirm your fixer prompt tells the agent to use the failing workflow run's `head_branch` as the pull request base.
- If the pull request changes files other than `app/src/domain.mjs`, review carefully. Mona wants the minimal source fix that makes `cd app && npm test` pass.
- If the original bug pull request stays red, confirm the stacked fixer pull request has been merged into `introduce-bug`. The original pull request only goes green after the stacked fix is merged.
- The final grading step only completes after the original bug pull request is merged into `main` and the tests are green on `main`.

</details>
