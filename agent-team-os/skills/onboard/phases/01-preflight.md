# Phase 1 — Pre-flight

**Time:** 10 minutes
**Ends with:** five boxes ticked, or a clear list of what to fix before continuing.

## Open with

> "Phase 1 of 12. Before we build anything, five quick checks. If one of them fails we stop
> here and fix it — it is much cheaper than finding out in phase 8."

## The five checks

Ask about one at a time. Wait for an answer before moving on.

### 1. Your Claude plan

> "Open `claude.ai/settings` and tell me what plan it says: Free, Pro, Max, or Team."

- **Free** — stop. Scheduled work is not available on Free. Say so plainly: "Everything
  we build will work, but nothing will run on its own until you are on Pro or higher. Do
  you want to upgrade now, or carry on and schedule things later?"
- **Pro, Max, Team** — tick.

### 2. Claude Code on the web

> "Go to `claude.ai/code`. Does it load a page where you can start a session?"

If not, walk them through enabling it in settings.

### 3. GitHub connected

> "On that same page, is your GitHub account connected? You should see your repositories
> listed when you go to start a session."

If not, the connect flow is in the web settings. This is a sign-in, not a token — do not
ask them for one.

### 4. A Google account

> "Do you have a Gmail address you use for work? We connect it in phase 6 so the email
> agent has an inbox to read."

Any Google account works. If they have none, that is fine — note it, and phase 6 will skip
the email agent.

### 5. A Vercel account that is ready

> "Open `vercel.com` and sign in with your GitHub. Does it take you straight to your dashboard,
> or does it ask you to verify a phone number?"

Phase 11 puts their phone dashboard on Vercel, and this is the check to do now, not then. A new
Vercel account can ask for phone verification and then lock the account for up to 12 hours; on
2026-09-23 that stopped a live install for the rest of the day. If it asks, do the verification
now, while phases 2 to 10 give it hours to clear. If it locks, note it and carry on: nothing
before phase 11 needs Vercel.

## Check

All five answered. Write the results into the state file's notes section, one line each.

Then say what happens next in one sentence: "Phase 2 creates your repo. Twenty minutes.
Continue or pause?"
