#!/usr/bin/env zx
import { $, argv, fs, os } from "zx";

const type = argv.type || argv.t;
let msg = '';
const upcomingFile = 'upcoming.md';

function assertType(type) {
  if (!['major', 'minor', 'patch'].includes(type)) {
    throw new Error(`Invalid type: ${type}`);
  }
}

const template = (type, msg) => `
---
"@apps/app1": ${type}
"@apps/e2e-app1-app2": ${type}
"@utils/async": ${type}
---

${msg}
`;

assertType(type);

if (!fs.existsSync(upcomingFile)) {
  throw new Error(`! No upcoming.md found, create and fill ${upcomingFile} first`);
}

msg = await fs.readFile(upcomingFile, 'utf8');

await $`chmod -R 777 .changeset`; // update permissions for execution
await $`chmod -R 777 releases`; // update permissions for releases
// await fs.copyFile(upcomingFile, `.changeset/${upcomingFile}`);

// create empty changeset file
await $`pnpm changeset --empty`;
await $`exit 0`; // exit with success

const { stdout: filename } = await $`find ${process.cwd()}/.changeset -type f -name '*.md' ! -name 'README.md'`; // find filename

await fs.writeFile(filename.trim(), template(type, msg)); // write changeset

await $`pnpm changeset version`; // add changeset

await $`pnpm install`; // install and resolve packages

const { stdout: version } = await $`pnpm version ${type} --no-git-tag-version`;

// write to releases folder release.
await fs.writeFile(`releases/${version.trim()}.md`, msg);
// fill upcoming.md release with empty string
console.log('cleanup upcoming file');
await fs.writeFile(upcomingFile, os.EOL);

const commitMsg = `${'Release ' + version.trim() + '\n\n' + msg}`;

// git commit message
await $`git add .`;
await $`git commit -m ${commitMsg}`;


// create git tag without pushing
await $`git tag -a ${version.trim()} -m ${commitMsg}`;

// push tag
await $`git push --follow-tags origin`;

// push main
await $`git push -u origin main`;
