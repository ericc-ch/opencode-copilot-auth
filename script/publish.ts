#!/usr/bin/env bun
import { $ } from "bun";
import { parseArgs } from "util";

const dir = new URL("..", import.meta.url).pathname;
process.chdir(dir);

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    otp: { type: "string" },
  },
  allowPositionals: true,
});

const bumpType = positionals[0] || "patch";
const otp = values.otp;

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
const otpFlag = otp ? `--otp=${otp}` : "";
await $`npm publish --access public ${otpFlag}`.nothrow();

console.log(`✓ Version bumped to ${version} and published to npm`);
