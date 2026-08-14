# ---------------------------------------------------------------------------
# Contract Makefile (claude-kit). The target NAMES are the contract; the
# commands behind them are this project's business. Consumers:
#
#   check-file  <- post-edit hook, after every Claude edit (keep it fast:
#                  linting only, seconds not minutes; type checking belongs
#                  in `check` — the LSP already reports type errors live)
#   check       <- /ship skill and CI: the full static pass
#
# Rules the hooks rely on:
#   - Recipes are indented with a TAB, not spaces ("missing separator"
#     means spaces sneaked in).
#   - Targets must be defined flat in this file. The hooks find them by
#     reading the Makefile, so a target behind `include` is invisible.
#   - FILE arrives project-relative and make runs from the project root,
#     so tool configs resolve exactly as they do in a terminal.
#   - A target you don't need can be deleted: the hooks skip silently
#     when a target is absent. Don't leave a target with an empty or
#     placeholder recipe — post-edit would run it and trust its exit code.
# ---------------------------------------------------------------------------

.PHONY: check check-file

check-file:
	pnpm exec eslint "$(FILE)"

check:
	pnpm run lint
	pnpm exec tsc --noEmit
	node scripts/check-utilities.mjs
