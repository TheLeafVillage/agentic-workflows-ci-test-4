# Agentic Workflows That Fix the Build

_Learn how to install GitHub Agentic Workflows and create an AI-powered workflow that helps Mona keep CI green by fixing failing builds._

## Welcome

- **Who is this for**: Developers, DevOps engineers, and anyone curious about self-healing automation in GitHub repositories.
- **What you'll learn**: How to install the `gh aw` extension, author an agentic workflow in markdown, compile it, and use it to diagnose failing CI and open a pull request with a fix.
- **What you'll build**: Mona's Issue Triage API plus a `autofix-ci` agentic workflow that watches the CI workflow, reproduces a failing Node.js test, makes a minimal source fix, and opens a pull request for review.
- **Prerequisites**:
  - A GitHub account with access to GitHub Copilot
  - Basic familiarity with GitHub repositories, branches, and pull requests
  - Comfort editing YAML and Markdown files

- **How long**: This exercise takes less than 45 minutes to complete.

In this exercise, you will:

1. Set up GitHub Agentic Workflows and meet Mona's green CI pipeline for the Issue Triage API.
1. Author and compile a `autofix-ci` agentic workflow that can investigate failing tests and open a fix PR.
1. Introduce a prescribed bug, watch CI fail, and let the fixer workflow auto-run.
1. Review the fixer's pull request, merge it, and confirm CI is green again.

### How to start this exercise

Simply copy the exercise to your account, then give your favorite Octocat (Mona) **about 20 seconds** to prepare the first lesson, then **refresh the page**.

> [!IMPORTANT]
> This exercise is designed for **public** repository copies.
> If you copied the exercise as a private repository, token setup may
> require additional account or organization policy configuration.

[![](https://img.shields.io/badge/Copy%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/new?template_owner=TheLeafVillage&template_name=agentic-workflows-ci&owner=%40me&name=agentic-workflows-ci&description=Exercise:+Agentic+Workflows+That+Fix+the+Build&visibility=private)

<details>
<summary>Having trouble? 🤷</summary><br/>

When copying the exercise, we recommend the following settings:

- For owner, choose your personal account or an organization to host the repository.

- We recommend creating a public repository, since private repositories will use Actions minutes.

If the exercise isn't ready in 20 seconds, please check the [Actions](../../actions) tab.

- Check to see if a job is running. Sometimes it simply takes a bit longer.

- If the page shows a failed job, please submit an issue. Nice, you found a bug! 🐛

</details>

---

&copy; 2026 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)
