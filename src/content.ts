import profileData from './content/profile.json';
import capabilityData from './content/capabilities.json';
import projectData from './content/projects.json';
import certificationData from './content/certifications.json';
import experienceData from './content/experience.json';
import journalData from './content/journal.json';

export type Project = {
  id: string; title: string; subtitle: string; summary: string; category: string;
  type: string; status: string; featured: boolean; visual: string; tools: string[];
  repository: string | null; report: string; evidence: string; contribution: string;
};
export type Profile = Omit<typeof profileData, 'linkedin' | 'cv'> & { linkedin: string | null; cv: string | null };
export type Capability = typeof capabilityData[number];
export type Article = { id: string; title: string; kind: 'report' | 'journal'; body: string; download: string };
export const profile = profileData as Profile;
export const capabilities = capabilityData;
export const projects: Project[] = projectData;
export const certifications = certificationData as {
  professional: Array<Omit<typeof certificationData.professional[number], 'verification'> & { verification: string | null }>;
  training: Array<Omit<typeof certificationData.training[number], 'url'> & { url: string | null }>;
};
export const experience = experienceData;
export const journal = journalData;
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const rawFiles = import.meta.glob('./content/{reports,journal}/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const fileUrls = import.meta.glob('./content/{reports,journal}/*.md', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export const articles: Article[] = [
  ...projects.map((project) => ({ id: project.report, title: project.title, kind: 'report' as const, folder: 'reports' })),
  ...journal.map((entry) => ({ id: entry.file, title: entry.title, kind: 'journal' as const, folder: 'journal' })),
].map((item) => {
  const key = `./content/${item.folder}/${item.id}.md`;
  return { ...item, body: rawFiles[key], download: fileUrls[key] };
});
