#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Script to add a registry to the project using shadcn CLI
 * Usage: node scripts/add-registry.js <registry-filename>
 * Example: node scripts/add-registry.js ghibli-theme.json
 */

// Configuration for the registry repository
const REGISTRY_CONFIG = {
  baseUrl: "../ghibli-theme-registry/registry/",
  repository: "aaort/ghibli-theme-registry",
  branch: "main",
  path: "registry",
};

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Error: Registry filename is required");
    console.log("Usage: node scripts/add-registry.js <registry-filename>");
    console.log("Example: node scripts/add-registry.js ghibli-theme.json");
    console.log(`Repository: ${REGISTRY_CONFIG.repository}`);
    console.log(`Base URL: ${REGISTRY_CONFIG.baseUrl}`);
    process.exit(1);
  }

  const registryFilename = args[0];

  // Construct the full registry URL
  const registryUrl = `${REGISTRY_CONFIG.baseUrl}${registryFilename}`;

  console.log(`🌐 Adding registry: ${registryFilename}`);
  console.log(`📍 Full URL: ${registryUrl}`);

  try {
    console.log("⏳ Running shadcn add command...");

    // Execute the shadcn command
    const command = `pnpm dlx shadcn@latest add ${registryUrl}`;
    console.log(`Executing: ${command}`);

    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Post-process: Move CSS files to correct location if needed
    const incorrectCssPath = join(process.cwd(), "src/components/index.css");
    const correctCssPath = join(process.cwd(), "src/index.css");

    if (existsSync(incorrectCssPath)) {
      console.log("📝 Moving CSS to correct location...");

      // Read the content from the incorrectly placed file
      const newCssContent = readFileSync(incorrectCssPath, "utf8");

      // If the correct CSS file exists, we need to merge or replace
      if (existsSync(correctCssPath)) {
        const existingContent = readFileSync(correctCssPath, "utf8");

        // Simple check to avoid duplicating content
        if (!existingContent.includes(newCssContent.trim())) {
          console.log("🔄 Merging CSS content...");
          writeFileSync(correctCssPath, newCssContent);
        } else {
          console.log("ℹ️ CSS content already exists in correct location");
        }
      } else {
        // Just move the content
        writeFileSync(correctCssPath, newCssContent);
      }

      // Remove the incorrectly placed file
      unlinkSync(incorrectCssPath);
      console.log("🗑️ Removed incorrectly placed CSS file");
    }

    console.log("✅ Registry added successfully!");
  } catch (error) {
    console.error("❌ Error adding registry:", error.message);
    process.exit(1);
  }
}

main();
