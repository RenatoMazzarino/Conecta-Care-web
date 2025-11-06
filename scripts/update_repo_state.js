#!/usr/bin/env node
// scripts/update_repo_state.js
// Usage: node scripts/update_repo_state.js --actor "AgentName" --message "Short summary" --files "file1,file2"

const fs = require('fs');
const path = require('path');

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function listDir(p) {
  try {
    return fs.readdirSync(p).filter(Boolean);
  } catch {
    return [];
  }
}

function arg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1];
}

const actor = arg('actor') || process.env.GIT_ACTOR || 'unknown';
const message = arg('message') || 'update from agent';
const filesArg = arg('files') || '';
const files = filesArg ? filesArg.split(',').map(s => s.trim()).filter(Boolean) : [];

// If no files provided, try to detect changed files via git (staged or unstaged)
if (files.length === 0) {
  try {
    const { execSync } = require('child_process');
    // Check if we're in a git repo
    execSync('git rev-parse --is-inside-work-tree', { cwd: repoRoot, stdio: 'ignore' });
    // Get changed files (staged and unstaged)
    const status = execSync('git status --porcelain', { cwd: repoRoot }).toString('utf8').trim();
    if (status) {
      const detected = status
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*[A-Z?]{0,2}\s+/, '').trim())
        .filter(Boolean);
      if (detected.length) {
        files.push(...detected);
      }
    } else {
      // if no local changes, use last commit files
      const last = execSync('git diff --name-only HEAD~1..HEAD', { cwd: repoRoot }).toString('utf8').trim();
      if (last) files.push(...last.split(/\r?\n/).filter(Boolean));
    }
  } catch {
    // git not available or command failed; leave files empty
  }
}

const repoRoot = path.resolve(__dirname, '..');
const pkg = readJSON(path.join(repoRoot, 'package.json')) || {};
const readme = fs.existsSync(path.join(repoRoot, 'README.md')) ? fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8') : '';
const migrationsSupabase = listDir(path.join(repoRoot, 'supabase', 'supabase', 'migrations'));
const migrationsPrisma = listDir(path.join(repoRoot, 'prisma', 'migrations'));
const functionsList = listDir(path.join(repoRoot, 'supabase', 'functions'));
const hasSeed = fs.existsSync(path.join(repoRoot, 'prisma', 'seed.ts'));

// try extract supabase project-ref from package.json sb:link script
let supabaseProjectRef = null;
if (pkg.scripts && pkg.scripts['sb:link']) {
  const m = pkg.scripts['sb:link'].match(/--project-ref\s+(\S+)/);
  if (m) supabaseProjectRef = m[1];
}

const timestamp = new Date().toISOString();
const entryLines = [];
entryLines.push(`## ${timestamp}`);
entryLines.push(`actor: ${actor}`);
entryLines.push(`message: ${message}`);
if (files.length) entryLines.push(`changed_files: ${files.join(', ')}`);
entryLines.push('');
entryLines.push('### snapshot');
entryLines.push(`- repo: ${pkg.name || ''} ${pkg.version || ''}`);
entryLines.push(`- node scripts present: ${fs.existsSync(path.join(repoRoot, 'scripts'))}`);
entryLines.push(`- dev server script: ${pkg.scripts && pkg.scripts.dev ? pkg.scripts.dev : 'n/a'}`);
entryLines.push(`- supabase project-ref: ${supabaseProjectRef || 'unknown'}`);
entryLines.push(`- supabase migrations (count): ${migrationsSupabase.length}`);
if (migrationsSupabase.length) entryLines.push(`  - ${migrationsSupabase.slice(-5).join(', ')}`);
entryLines.push(`- prisma migrations (count): ${migrationsPrisma.length}`);
entryLines.push(`- edge functions: ${functionsList.join(', ') || 'none'}`);
entryLines.push(`- seed script present: ${hasSeed}`);
entryLines.push('');
entryLines.push('### README excerpt (first 6 lines)');
entryLines.push('');
entryLines.push(...readme.split(/\r?\n/).slice(0, 6));
entryLines.push('');
entryLines.push('---');

const outPath = path.join(repoRoot, '.github', 'REPO_STATE.md');
let current = '\n';
if (fs.existsSync(outPath)) {
  current = fs.readFileSync(outPath, 'utf8');
}
const newContent = `${current}\n${entryLines.join('\n')}`;
fs.writeFileSync(outPath, newContent, 'utf8');
console.log(`Wrote ${outPath}`);
