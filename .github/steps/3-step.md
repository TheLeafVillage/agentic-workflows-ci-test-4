## Step 3: Introduce a bug and watch CI fail

You built Mona's fixer workflow in Step 2. Now you'll simulate a real developer mistake in Mona's Issue Triage API so **CI** fails on an open pull request and the fixer can respond with a stacked fix PR.

### 📖 Theory: A safe failure for the fixer to diagnose

You'll introduce a bug by adding a new `topPriority` helper to Mona's Issue Triage API. It is supposed to return the highest-scoring issues first, but it ships with its sort backwards, so a new test fails and **CI** goes red. That is exactly the kind of failure a build fixer should catch on a pull request before it reaches `main`.

You'll add that feature and its test on a new branch named `introduce-bug`, open a pull request into `main`, and leave it open. **CI** starts when the pull request is opened; the push alone does not start CI because the push trigger only watches `main`. When **CI** goes red, the `autofix-ci` agentic workflow you created in Step 2 should automatically run because it listens for failed **CI** runs, then open a stacked fix PR whose base is `introduce-bug`.

> [!IMPORTANT]
> Do **not** enable required status checks or branch protection for this workshop repository. This workshop intentionally creates and repairs a failing pull request, and required checks can complicate the demo flow.

### :keyboard: Activity: Add a broken feature and inspect the failing run

1. In the ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff) **terminal window**, make sure your local `main` branch is current, then create a new branch for the simulated mistake.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git checkout main
   > git pull
   > git checkout -b introduce-bug
   > ```

2. Open `app/src/domain.mjs` and add a new `topPriority` helper at the end of the file.

   It is supposed to return the highest-scoring issues first, but it ships with the comparator backwards (ascending instead of descending), so it returns the *lowest*-priority issues:

   ```js
   export function topPriority(issues, count) {
     const limit = Math.max(0, Math.trunc(Number(count)) || 0);
     return [...issues]
       .map((issue) => ({ issue, score: scoreIssue(issue) }))
       .sort((a, b) => a.score - b.score)
       .slice(0, limit)
       .map(({ issue }) => issue);
   }
   ```

3. Open `app/test/domain.test.mjs` and add a test for the new helper.

   First add `topPriority` to the import at the top of the file.

   Before:

   ```js
   import { filterByLabel, paginate, scoreIssue, sortByPriority } from '../src/domain.mjs';
   ```

   After:

   ```js
   import { filterByLabel, paginate, scoreIssue, sortByPriority, topPriority } from '../src/domain.mjs';
   ```

   Then add this test suite at the end of the file:

   ```js
   describe('topPriority', () => {
     it('returns the highest scoring issues first', () => {
       assert.deepEqual(
         topPriority(fixtures, 2).map((issue) => issue.id),
         ['critical-bug', 'security'],
         'topPriority should list issues from highest score to lowest score'
       );
     });
   });
   ```

4. Commit both files and push your branch.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > git add app/src/domain.mjs app/test/domain.test.mjs
   > git commit -m "Add topPriority helper with a sort bug"
   > git push -u origin introduce-bug
   > ```

5. Open pull request 5 into `main` with a title like `Add topPriority helper`, then leave the pull request open.

   Do **not** merge this pull request yet. Opening the pull request starts **CI**, and this first CI run should go red.

   <!-- TODO screenshot: open pull request that introduces the topPriority sort bug -->

6. Open the **Actions** tab and select the **CI** workflow.

7. Open the failing **CI** run for pull request 5 and read the test output. You should see the assertion message:

   ```text
   topPriority should list issues from highest score to lowest score
   ```

   <!-- TODO screenshot: CI run log showing the failing topPriority assertion -->

8. Return to the **Actions** tab and watch for the `autofix-ci` workflow. Because **CI** failed on pull request 5, Mona's fixer should start automatically and work toward a stacked pull request that repairs the build with base branch `introduce-bug`.

   <!-- TODO screenshot: autofix-ci workflow run triggered after the failed CI run -->

9. Wait about 20 seconds, then refresh the exercise issue. Mona will check that the buggy `topPriority` helper and its test are present on the open `introduce-bug` pull request before posting Step 4. The fixer may take a few minutes to open its stacked PR, so keep pull request 5 open while you wait.

<details>
<summary>Having trouble? 🤷</summary><br/>

- If **CI** does not fail, confirm `app/src/domain.mjs` contains `a.score - b.score` inside the new `topPriority` function, and confirm `app/test/domain.test.mjs` imports and tests `topPriority`, on the open `introduce-bug` pull request.
- Remember that **CI** starts when pull request 5 is opened, not when you push `introduce-bug`.
- If the `autofix-ci` workflow does not start automatically, first re-trigger a real **CI** failure so a fresh `workflow_run` event fires: push an empty commit to `introduce-bug`, or close and reopen pull request 5.
- If you still need a manual safety valve, open the **Actions** tab, select `autofix-ci`, and use **Run workflow** only if your sample includes the `workflow_dispatch` `branch` input, using `introduce-bug` as the branch.
- Confirm the `COPILOT_GITHUB_TOKEN` secret is configured as an Actions secret.
- Open the `autofix-ci` run logs and read the agent output for the next clue.
- Confirm `allowed-base-branches` allows the failing feature branch (for example with `**`) and excludes `main`.

</details>
