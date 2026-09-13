// Runs on `git commit` via the Husky pre-commit hook (see .husky/pre-commit).
export default {
  // Lint + auto-fix only the staged files (fast).
  "*.{ts,tsx,js,jsx,mjs}": ["eslint --fix --no-warn-ignored"],
  // Type-checking needs the whole project, so ignore the matched file list and
  // run a single project-wide check whenever any TS file is staged.
  "*.{ts,tsx}": () => "tsc --noEmit",
};
