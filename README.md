# Quest Board — Taqtile Challenge

## About

This project is an incomplete fullstack Quest Board application (backend API + React frontend) with a fantasy RPG theme: quests, each with a difficulty and an XP reward. Your task is to complete the missing pieces, connecting both layers.

The main purpose of this challenge is not to evaluate the candidates' prior knowledge of any specific framework, but to show us how they solve a problem, how they study for it, and how they use AI tools as part of their workflow.

The candidates should think of this challenge as their first task working at Taqtile, so what they deliver in this challenge is what we would expect from their work in a real project given the same constraints.

## TODOs

- [ ]  Clone this repository, then create your own copy under your own GitHub account (e.g. using GitHub's "Use this template" button, or by cloning and pushing to a new empty repository you create) — do not push commits or open pull requests against this repository. Your work happens entirely in your own copy.

## General guidelines

The candidates' solution does not need to be visually polished — we care more about how the problem was approached than about pixel-perfect UI.

We ask candidates to *not* share their final code with classmates or ask others for the solution to this challenge. Candidates are more than welcome to ask us about any doubts, discuss possible approaches with colleagues, and share interesting references with each other.

Candidates should send us their final solution as a link to a public (or shared) GitHub repository.

Candidates should complete the `REFERENCES.md` file with the references they used to complete the challenge. A solution without references will be considered incomplete.

## Using OpenCode

This challenge should be completed with the help of **OpenCode**, a CLI coding agent. It comes preconfigured in this repository with a tracking plugin — no additional setup is needed besides installing the tool itself.

**1. Install OpenCode**

```bash
npm install -g opencode-ai
# or:
curl -fsSL https://opencode.ai/install | bash
```

**2. Run it inside the project folder**

```bash
cd quest-board
opencode
```

This opens OpenCode's terminal interface. From there, talk to it as you normally would to ask for help, generate code, or review your changes — this is how we expect you to work throughout the challenge.

**3. Confirm tracking is active**

The tracking plugin is already registered at `.opencode/plugin/tracking.ts` and runs automatically every session. You can confirm it's working by checking that `.opencode/logs/session.jsonl` is being created and updated as you use the tool.

- **Do not delete, edit, or disable the tracking plugin.** It's part of the evaluation — we want to understand how you use AI as a work tool, not just the final result.
- You're welcome to consult other sources (documentation, Stack Overflow, another AI) as occasional support, but the actual development should go through OpenCode so your usage history gets recorded.

## Tips

- Read the API documentation carefully before implementing the difficulty rule — edge cases (empty titles, mixed casing) are worth thinking through.
- Test the endpoint independently (e.g. with `curl` or an HTTP client) before wiring it up to the frontend — it's easier to isolate bugs that way.

## How to run the project

- **Backend** — Elysia REST API + PostgreSQL, at the root of this repo (`apps/`, `packages/`). Setup (Docker, migrations, env vars), running, testing and architecture: [`BACKEND.md`](BACKEND.md).

## What will be evaluated

- Whether the TODOs were solved correctly;
- Code quality and clarity (naming, organization, error handling);
- How AI was used: specific vs. generic prompts, whether generated code was tested before being accepted, whether the candidate understands what the code does;
- Ability to explain their decisions during the technical interview.

Good luck! If you have any doubts about the scope, reach out to us.
