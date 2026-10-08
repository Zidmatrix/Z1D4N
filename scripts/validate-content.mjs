import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const read = (name) => JSON.parse(readFileSync(resolve(root, 'src/content', `${name}.json`), 'utf8'));
const requiredText = (value, label) => assert(typeof value === 'string' && value.trim().length > 0, `${label} must be nonempty text`);
const slug = (value, label) => assert(typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), `${label} must be a lowercase hyphenated slug`);
const unique = (items, label) => assert.equal(new Set(items.map((x) => x.id)).size, items.length, `${label} IDs must be unique`);
const url = (value, label) => { if (value !== null) { requiredText(value, label); assert.equal(new URL(value).protocol, 'https:', `${label} must use HTTPS`); } };
const localFile = (value, label) => {
  requiredText(value, label);
  assert(!value.includes('..') && !value.startsWith('/') && !value.includes(':'), `${label} must be a safe relative path`);
  assert(existsSync(resolve(root, 'public', value)), `${label} file does not exist: ${value}`);
};
const markdown = (folder, name) => {
  slug(name, `${folder} file`);
  const path = resolve(root, 'src/content', folder, `${name}.md`);
  assert(existsSync(path), `Missing Markdown: ${path}`);
  assert(readFileSync(path, 'utf8').trim().startsWith('# '), `${path} needs a real title and content`);
};

const profile = read('profile');
['name', 'brand', 'title', 'intro', 'about', 'location'].forEach((key) => requiredText(profile[key], `profile.${key}`));
assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email), 'Email must be valid');
assert(/^\+[1-9]\d{7,14}$/.test(profile.phone), 'Phone must use international format');
url(profile.github, 'GitHub'); url(profile.linkedin, 'LinkedIn');
localFile(profile.portrait, 'Portrait');
if (profile.cv !== null) { localFile(profile.cv, 'CV'); assert(profile.cv.endsWith('.pdf'), 'CV must be a reviewed PDF'); }

const projects = read('projects');
unique(projects, 'Projects');
for (const project of projects) {
  slug(project.id, 'Project ID');
  ['title', 'summary', 'subtitle', 'category', 'type', 'status', 'evidence', 'contribution'].forEach((key) => requiredText(project[key], `project.${key}`));
  assert.equal(typeof project.featured, 'boolean');
  assert(Array.isArray(project.tools) && project.tools.length > 0, 'Project needs tools');
  url(project.repository, 'Repository'); markdown('reports', project.report);
}
const capabilities = read('capabilities');
unique(capabilities, 'Capabilities');
for (const capability of capabilities) {
  requiredText(capability.evidence, 'Capability evidence context');
  assert(capability.project === null || projects.some((project) => project.id === capability.project), 'Capability refers to an unknown project');
}
const certificates = read('certifications');
unique([...certificates.professional, ...certificates.training], 'Credentials');
for (const certificate of certificates.professional) {
  ['name', 'issuer', 'status'].forEach((key) => requiredText(certificate[key], `certificate.${key}`));
  url(certificate.verification, 'Issuer verification');
}
for (const item of certificates.training) { requiredText(item.evidence, 'Training evidence context'); url(item.url, 'Training evidence URL'); }
const journal = read('journal'); unique(journal, 'Journal');
for (const entry of journal) {
  slug(entry.id, 'Journal ID');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(entry.date) && new Date(entry.date).toISOString().startsWith(entry.date), 'Journal date must be a real ISO date');
  ['title', 'summary', 'category', 'status'].forEach((key) => requiredText(entry[key], `journal.${key}`));
  markdown('journal', entry.file);
}
unique(read('experience'), 'Experience');
console.log(`Content valid: ${projects.length} projects, ${capabilities.length} capabilities, ${certificates.professional.length} professional certifications, ${certificates.training.length} training entries, ${journal.length} journal entry.`);
