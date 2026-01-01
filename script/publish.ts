#!/usr/bin/env bun
import { $ } from "bun";

const dir = new URL("..", import.meta.url).pathname;
process.chdir(dir);

const bumpType = process.argv[2] || "patch";

console.log(`Bumping ${bumpType} version...`);

// Bump version in package.json
await $`npm version ${bumpType} --no-git-tag-version`;

// Read the new version
const pkg = await Bun.file("./package.json").json();
const version = pkg.version;

console.log(`New version: ${version}`);

// Commit the version bump
await $`git add package.json`;
await $`git commit -m "Bump version to ${version}"`;
await $`git push`;

// Install dependencies and publish to npm
console.log("Publishing to npm...");
await $`npm publish --access public`;

console.log(`✓ Version bumped to ${version} and published to npm`);
