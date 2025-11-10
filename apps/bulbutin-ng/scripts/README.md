# Scripts

## setup-env.sh

Post-install script that automatically configures git to ignore local changes to `environment.local.ts`.

**What it does:**
- Runs automatically after `npm install`
- Applies `git update-index --skip-worktree` to `src/environments/environment.local.ts`
- Allows developers to add their Mapbox tokens without risk of committing them

**When it runs:**
- Automatically via npm's `postinstall` hook
- Can be run manually: `./scripts/setup-env.sh`

**Why this is needed:**
The `environment.local.ts` file must exist in the repository for Netlify builds (TypeScript needs to compile it), but each developer needs to add their own Mapbox token locally. The `--skip-worktree` flag tells git to ignore local changes to this file, preventing accidental commits of API tokens.
