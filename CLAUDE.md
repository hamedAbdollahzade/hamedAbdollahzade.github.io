# Project rules

Read `AGENTS.md` first (Next.js 16 differs from older versions).

## Contact and links (strict)

- Every phone number, WhatsApp link, call button and contact form on the site goes to the owner only: use `BRAND` in `data/services.ts` (`phone`, `phoneDisplay`, `whatsapp`) and `waLink()` from `lib/site.ts`. Never hard-code a number.
- Every GitHub link on the site is the owner's: `https://github.com/hamedAbdollahzade`.
- Never put another person's phone number, username/ID or GitHub link anywhere on the site (team members, mentors, project authors, explore posts). Show their name only.
- Team members and their projects may be listed by name; a project built by someone else shows the builder's name on its detail page (`author` in `data/projects.ts`), not in titles or cards.

## Workflow

- Work on a new branch, commit, then wait for an explicit "merge and push" before merging into `main` and pushing.
- Do not commit `.idea`. Do not leave TODO comments or files. Keep `README.md` short and in English.
