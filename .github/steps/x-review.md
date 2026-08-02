## Review

_Congratulations, you completed **Agentic Workflows That Fix the Build** and helped Mona build a self-healing CI workflow!_ 🎉

<img src="https://octodex.github.com/images/jetpacktocat.png" alt="Mona celebrating a green build" width=200 align=right>

Pull the latest changes from `main`, then take a look at the merged stacked fixer pull request and the final green **CI** run for Mona's Issue Triage API.

<!-- TODO screenshot: final green CI run and merged fixer pull request. -->

Here's what you accomplished:

- **Set up GitHub Agentic Workflows** — You installed `gh aw` support, added the setup files, and prepared the repository to compile agentic workflows.
- **Met Mona's API and CI pipeline** — You worked with the Express-based Issue Triage API and confirmed its Node.js tests start from a green baseline.
- **Built a `autofix-ci` workflow** — You authored and compiled an agentic workflow that can inspect failing CI, reproduce `npm test`, make a minimal fix, and open a stacked fix pull request on the failing branch.
- **Practiced self-healing CI** — You introduced a prescribed bug, watched CI fail, and saw the fixer workflow respond.
- **Reviewed the fix** — You inspected the generated stacked pull request, merged it into `introduce-bug`, then merged the original bug pull request into `main` after CI returned to green.

### What's next?

- **Tune the fixer prompt** with extra guardrails for test scope, commit style, or escalation rules.
- **Add more CI signals** such as linting, type checks, or integration tests for the fixer to diagnose.
- **Create companion workflows** for flaky-test triage, dependency update failures, or issue prioritization.
- **Explore more docs** at the [GitHub Agentic Workflows site](https://github.github.com/gh-aw/).
