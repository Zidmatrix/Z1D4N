import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Cpu,
  FileText,
  GitBranch as Github,
  GraduationCap,
  Languages,
  MapPin,
  Menu,
  Network,
  Phone,
  Search,
  Shield,
  Waves,
  X,
} from "lucide-react";
import {
  articles,
  asset,
  capabilities,
  certifications,
  experience,
  journal,
  profile,
  profileLinks,
  projects,
} from "./content";
import NetworkVisual from "./components/NetworkVisual";
import ProjectVisual from "./components/ProjectVisual";
import ArticleDialog from "./components/ArticleDialog";
import CvPreview from "./components/CvPreview";
import DocumentPreview from "./components/DocumentPreview";

const nav = [
  { id: "work", name: "Work" },
  { id: "about", name: "About" },
  { id: "capabilities", name: "Capabilities" },
  { id: "certifications", name: "Certifications" },
  { id: "links", name: "Links" },
  { id: "journal", name: "Journal" },
];
const capabilityIcons = [Shield, Network, Cpu, Code2];
function Brand() {
  return (
    <a href="#top" className="brand" aria-label="Z!DVN — back to top">
      Z<span>!</span>DVN<span className="brand-period">.</span>
    </a>
  );
}
function safeMotionSetting() {
  try {
    return localStorage.getItem("zidvn-reduced-motion") === "true";
  } catch {
    return false;
  }
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("All");
  const [archiveQuery, setArchiveQuery] = useState("");
  const [hash, setHash] = useState(() => window.location.hash);
  const [reduced, setReduced] = useState(safeMotionSetting);
  const [systemReduced, setSystemReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [copyState, setCopyState] = useState("Copy email");
  const menuButton = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const article = articles.find((item) => hash === `#${item.kind}/${item.id}`);
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];
  const visible = projects.filter(
    (project) =>
      project.featured && (category === "All" || category === project.category),
  );
  const archived = projects.filter((project) =>
    [project.title, project.summary, project.category, ...project.tools]
      .join(" ")
      .toLowerCase()
      .includes(archiveQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    const listener = () => {
      setHash(window.location.hash);
      setMobileOpen(false);
    };
    window.addEventListener("hashchange", listener);
    let navigationFrame: number | undefined;
    const refreshNavigation = () => {
      navigationFrame = undefined;
      const marker = Math.max(220, Math.min(window.innerHeight * 0.3, 320));
      let current = "";
      for (const item of nav) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= marker)
          current = item.id;
      }
      setActive(current);
    };
    const scheduleNavigation = () => {
      if (navigationFrame === undefined)
        navigationFrame = requestAnimationFrame(refreshNavigation);
    };
    refreshNavigation();
    window.addEventListener("scroll", scheduleNavigation, { passive: true });
    window.addEventListener("resize", scheduleNavigation);
    const layoutObserver = new ResizeObserver(scheduleNavigation);
    layoutObserver.observe(document.getElementById("main")!);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setSystemReduced(media.matches);
    media.addEventListener("change", onMotion);
    const onEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        menuButton.current?.getAttribute("aria-expanded") === "true"
      ) {
        setMobileOpen(false);
        menuButton.current.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("hashchange", listener);
      window.removeEventListener("scroll", scheduleNavigation);
      window.removeEventListener("resize", scheduleNavigation);
      layoutObserver.disconnect();
      if (navigationFrame !== undefined) cancelAnimationFrame(navigationFrame);
      media.removeEventListener("change", onMotion);
      document.removeEventListener("keydown", onEscape);
      clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion =
      reduced || systemReduced ? "reduced" : "full";
    try {
      localStorage.setItem("zidvn-reduced-motion", String(reduced));
    } catch {
      /* The site also works without storage. */
    }
  }, [reduced, systemReduced]);
  useEffect(() => {
    // Hash links render before the initial deep-link scroll on a static host.
    if (hash && !hash.startsWith("#report/") && !hash.startsWith("#journal/"))
      document.getElementById(hash.slice(1))?.scrollIntoView();
  }, []);

  function closeArticle() {
    window.location.hash = article?.kind === "journal" ? "journal" : "work";
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("Email copied");
    } catch {
      setCopyState("Use the email link");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("Copy email"), 2500);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav
            aria-label="Main navigation"
            id="main-navigation"
            className={mobileOpen ? "main-nav open" : "main-nav"}
          >
            {nav.map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => setMobileOpen(false)}
                aria-current={active === item.id ? "location" : undefined}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              className="nav-contact"
              onClick={() => setMobileOpen(false)}
            >
              Let’s talk <ArrowUpRight size={15} />
            </a>
          </nav>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-controls="main-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
      <main id="main">
        <section
          id="top"
          className="hero container"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="small-cross">+</span> SECURITY-MINDED.
              SYSTEMS-CURIOUS.
            </span>
            <h1 id="hero-title">
              Understand
              <br />
              systems.<span>Build with intent.</span>
            </h1>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                Explore my work <ArrowUpRight size={19} />
              </a>
              <a
                className="button secondary"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} /> GitHub <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="hero-person">
              <img
                src={asset(profile.portrait)}
                alt=""
                width="42"
                height="42"
              />
              <div>
                <strong>{profile.name}</strong>
                <span>
                  <MapPin size={12} />
                  {profile.location}
                  <i />
                  {profile.title}
                </span>
              </div>
            </div>
          </div>
          <NetworkVisual />
          <div className="hero-bottom">
            <a href="#work">
              <ArrowDown size={16} /> SCROLL TO EXPLORE
            </a>
            <span>CURIOUS BY NATURE. PRECISE BY PRACTICE.</span>
          </div>
        </section>
        <div className="credential-strip">
          <div className="container">
            <span className="micro">A FOUNDATION TO BUILD ON</span>
            <div>
              <Shield size={17} />
              <span>CompTIA Security+</span>
            </div>
            <div>
              <Network size={17} />
              <span>Cisco CCNA</span>
            </div>
            <div>
              <Cpu size={17} />
              <span>CompTIA A+</span>
            </div>
            <div>
              <Languages size={17} />
              <span>English · {certifications.english.cefr}</span>
            </div>
            <a href="#certifications">
              View certifications <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <section
          id="work"
          className="section container"
          aria-labelledby="work-title"
        >
          <div className="section-title">
            <div>
              <span className="eyebrow">
                <span>01</span> SELECTED WORK
              </span>
              <h2 id="work-title">
                Ideas you can inspect<span className="accent">.</span>
              </h2>
            </div>
            <p>
              Real source. Clear context. Honest limitations.
              <br />A growing collection of technical work.
            </p>
          </div>
          <div
            className="filter-bar"
            role="group"
            aria-label="Filter featured projects by category"
          >
            {categories.map((item) => (
              <button
                className={category === item ? "filter active" : "filter"}
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
            <span className="micro filter-note">WORK, WITH CONTEXT</span>
          </div>
          <div className="project-grid" aria-live="polite">
            {visible.map((project, index) => (
              <article className="project-card" key={project.id}>
                <a
                  className="project-art-link"
                  href={`#report/${project.report}`}
                  aria-label={`Read ${project.title} report`}
                >
                  <ProjectVisual kind={project.visual} />
                  <span className="project-open">
                    <ArrowUpRight size={23} />
                  </span>
                </a>
                <div className="project-content">
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>
                      0{index + 1} / {project.type}
                    </span>
                  </div>
                  <h3>
                    <a href={`#report/${project.report}`}>{project.title}</a>
                  </h3>
                  <p>{project.summary}</p>
                  <div className="tags">
                    {project.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  <div className="project-footer">
                    <a href={`#report/${project.report}`} className="text-link">
                      Read the case study <ArrowUpRight size={16} />
                    </a>
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                        aria-label={`View ${project.title} source`}
                      >
                        <Github size={17} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="empty-state">
              No featured projects in this category yet. Browse the full archive
              below.
            </p>
          )}
          <details className="archive">
            <summary>
              <div>
                <span className="micro">THE FULL COLLECTION</span>
                <h3>
                  Project archive{" "}
                  <span>{String(projects.length).padStart(2, "0")}</span>
                </h3>
              </div>
              <ChevronDown size={22} />
            </summary>
            <div className="archive-content">
              <div className="archive-search">
                <label htmlFor="archive-search">Search project archive</label>
                <div className="search-field">
                  <Search size={17} />
                  <input
                    id="archive-search"
                    type="search"
                    placeholder="Search by title, topic or tool"
                    value={archiveQuery}
                    onChange={(event) => setArchiveQuery(event.target.value)}
                  />
                  {archiveQuery && (
                    <button
                      className="icon-button"
                      onClick={() => setArchiveQuery("")}
                      aria-label="Clear archive search"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
                <span className="micro" role="status">
                  {archived.length} of {projects.length} projects
                </span>
              </div>
              {archived.map((project) => (
                <div className="archive-row" key={project.id}>
                  <div>
                    <span className="micro">{project.category}</span>
                    <a href={`#report/${project.report}`}>
                      {project.title} <ArrowUpRight size={16} />
                    </a>
                    <p>{project.evidence}</p>
                  </div>
                  <div className="archive-secondary">
                    <span className="status-tag">{project.status}</span>
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                        aria-label={`Open ${project.title} repository`}
                      >
                        <Github size={16} /> Source <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {archived.length === 0 && (
                <div className="archive-empty">
                  <p>No projects match your search.</p>
                  <button
                    className="text-link"
                    onClick={() => setArchiveQuery("")}
                  >
                    Clear search <ArrowUpRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </details>
        </section>

        <section
          id="about"
          className="section about-section"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div className="portrait-frame">
              <img
                src={asset(profile.portrait)}
                alt="Abdulrahman Zidan"
                width="640"
                height="640"
                loading="lazy"
              />
              <span className="portrait-corner corner-one" />
              <span className="portrait-corner corner-two" />
              <div className="portrait-caption">
                <span className="micro">THE PERSON BEHIND THE WORK</span>
                <span>AZ / EGYPT</span>
              </div>
            </div>
            <div className="about-copy">
              <span className="eyebrow">
                <span>02</span> ABOUT ME
              </span>
              <h2 id="about-title">
                A technical identity.
                <br />A wider perspective.
              </h2>
              <p className="large-body">{profile.about}</p>
              <p>
                I’m at the beginning of my career. The goal is to keep learning,
                build thoughtfully, and explain the decisions behind the work.
              </p>
              <div className="about-foot">
                <div>
                  <span className="micro">PRIMARY DIRECTION</span>
                  <strong>Cybersecurity</strong>
                </div>
                <a
                  href="#capabilities"
                  className="round-link"
                  aria-label="Explore technical capabilities"
                >
                  <ArrowDown size={23} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="section container"
          aria-labelledby="capabilities-title"
        >
          <div className="section-title">
            <div>
              <span className="eyebrow">
                <span>03</span> TECHNICAL CAPABILITIES
              </span>
              <h2 id="capabilities-title">
                Different layers. Shared thinking.
              </h2>
            </div>
            <p>
              Certification, study and practical use.
              <br />
              Each with its own evidence and context.
            </p>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index];
              const linkedProject = projects.find(
                (project) => project.id === capability.project,
              );
              return (
                <article
                  id={`capability-${capability.id}`}
                  className="capability-card"
                  key={capability.id}
                >
                  <div className="capability-top">
                    <Icon size={26} strokeWidth={1.5} />
                    <span className="micro">{capability.index}</span>
                  </div>
                  <h3>{capability.name}</h3>
                  <span className="level-tag">{capability.level}</span>
                  <p>{capability.description}</p>
                  <div className="tags">
                    {capability.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  <details className="evidence-details">
                    <summary>
                      Evidence & context <ChevronDown size={15} />
                    </summary>
                    <p>{capability.evidence}</p>
                    {linkedProject && (
                      <a
                        className="text-link"
                        href={`#report/${linkedProject.report}`}
                      >
                        Review the work <ArrowUpRight size={15} />
                      </a>
                    )}
                  </details>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="certifications"
          className="section container certifications-section"
          aria-labelledby="certifications-title"
        >
          <span id="credentials" className="anchor-alias" aria-hidden="true" />
          <div className="section-title">
            <div>
              <span className="eyebrow"><span>04</span> CERTIFICATIONS</span>
              <h2 id="certifications-title">Certifications<span className="accent">.</span></h2>
            </div>
            <p>Security training and English proficiency.<br />Explore the original certificates.</p>
          </div>
          <div className="certificate-gallery">
            {certifications.documents.map((document) => (
              <DocumentPreview
                key={document.id}
                id={document.id}
                src={asset(document.src)}
                name={document.name}
                label={document.label}
                eyebrow={document.eyebrow}
                kind={document.kind}
                description={document.description}
                imageAlt={document.imageAlt ?? undefined}
                viewOnly
              />
            ))}
          </div>
        </section>

        <section
          id="qualifications"
          className="section credential-section"
          aria-labelledby="qualifications-title"
        >
          <div className="container">
            <div className="section-title">
              <div>
                <span className="eyebrow"><span>05</span> FOUNDATIONS & TRAINING</span>
                <h2 id="qualifications-title">The foundations matter.</h2>
              </div>
              <p>Professional exams, coursework and practice.<br />The background behind the documents.</p>
            </div>
            <div className="subsection-heading">
              <h3>Professional Certifications</h3>
              <p>
                Exam passes reported by me; issuer verification has not been
                reviewed.
              </p>
            </div>
            <div className="certification-grid">
              {certifications.professional.map((cert) => (
                <article className="certification-card" key={cert.id}>
                  <div className="cert-mark" aria-hidden="true">
                    {cert.mark}
                  </div>
                  <span className="micro">{cert.issuer}</span>
                  <h4>{cert.name}</h4>
                  <p>{cert.focus}</p>
                  <span className="cert-status">{cert.status}</span>
                  {cert.id === "security-plus" && (
                    <a
                      className="text-link cert-preview-link"
                      href="#security-plus-certificate"
                    >
                      View course certificate <ArrowDown size={16} />
                    </a>
                  )}
                  {cert.verification && (
                    <a
                      className="text-link"
                      href={cert.verification}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Issuer evidence <ArrowUpRight size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
            <div className="subsection-heading training-heading">
              <h3>Training</h3>
              <span className="micro">COURSEWORK & PRACTICE</span>
            </div>
            <div className="training-list">
              {certifications.training.map((training) => (
                <details key={training.id} className="training-item">
                  <summary>
                    <div>
                      <span className="training-provider">
                        {training.provider}
                      </span>
                      <h4>{training.name}</h4>
                    </div>
                    <ChevronDown size={20} />
                  </summary>
                  <div className="training-detail">
                    <p>{training.detail}</p>
                    <span className="micro">{training.evidence}</span>
                    {training.document && (
                      <a className="text-link" href={`#${training.document}`}>
                        View certificate <ArrowUpRight size={15} />
                      </a>
                    )}
                    {training.url && (
                      <a
                        className="text-link"
                        href={training.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View training evidence <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="section container"
          aria-labelledby="experience-title"
        >
          <div className="section-title">
            <div>
              <span className="eyebrow">
                <span>06</span> EXPERIENCE & EDUCATION
              </span>
              <h2 id="experience-title">A practice in progress.</h2>
            </div>
            <p>
              Learning, training and practical use.
              <br />A clear picture of where I am today.
            </p>
          </div>
          <div className="experience-layout">
            <div className="experience-list">
              {experience.map((item, index) => (
                <article className="experience-item" key={item.id}>
                  <span className="experience-number">0{index + 1}</span>
                  <div>
                    <span className="micro">{item.kind}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="education-card" aria-labelledby="education-title">
              <GraduationCap size={30} strokeWidth={1.5} />
              <span className="micro">EDUCATION</span>
              <h3 id="education-title">{profile.education.institution}</h3>
              <p className="degree">{profile.education.degree}</p>
              <div className="education-facts">
                <div>
                  <span>Study period</span>
                  <strong>{profile.education.period}</strong>
                </div>
                <div>
                  <span>Expected graduation</span>
                  <strong>{profile.education.graduation}</strong>
                </div>
                <div>
                  <span>GPA</span>
                  <strong>{profile.education.gpa}</strong>
                </div>
              </div>
              <div className="award">
                <span className="award-star" aria-hidden="true">
                  ✳
                </span>
                <p>{profile.education.award}</p>
              </div>
              <span className="micro">COURSEWORK</span>
              <div className="tags">
                {profile.education.subjects.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="links" className="section container links-section" aria-labelledby="links-title">
          <div className="section-title">
            <div>
              <span className="eyebrow"><span>07</span> AROUND THE WEB</span>
              <h2 id="links-title">Links<span className="accent">.</span></h2>
            </div>
            <p>Find me on the platforms I use.</p>
          </div>
          <div className="profile-link-grid">
            {profileLinks.map((link) => {
              const Icon = link.id === "github" ? Github : link.id === "hackthebox" ? Box : Shield;
              return (
                <a key={link.id} className="profile-link-card" href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="profile-link-icon" aria-hidden="true"><Icon size={26} strokeWidth={1.5} /></span>
                  <span className="profile-link-name">{link.name}</span>
                  <ArrowUpRight size={20} className="profile-link-arrow" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="journal"
          className="section journal-section"
          aria-labelledby="journal-title"
        >
          <div className="container">
            <div className="section-title">
              <div>
                <span className="eyebrow">
                  <span>08</span> LEARNING JOURNAL
                </span>
                <h2 id="journal-title">Keep the thinking visible.</h2>
              </div>
              <p>
                Notes, decisions and lessons along the way.
                <br />A record to revisit, not a highlight reel.
              </p>
            </div>
            <div className="journal-list">
              {journal.map((entry) => (
                <a
                  className="journal-entry"
                  key={entry.id}
                  href={`#journal/${entry.file}`}
                >
                  <div className="journal-date">
                    <time dateTime={entry.date}>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "2-digit",
                        timeZone: "UTC",
                      }).format(new Date(`${entry.date}T00:00:00Z`))}
                    </time>
                    <span>{entry.date.slice(0, 4)}</span>
                  </div>
                  <div className="journal-copy">
                    <span className="micro">
                      {entry.category} / {entry.status}
                    </span>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                  </div>
                  <ArrowUpRight size={25} />
                </a>
              ))}
            </div>
            <div className="journal-footnote">
              <FileText size={15} />
              <span>
                Written in Markdown. Built for weekly reflection. Linked to
                evidence when available.
              </span>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section container contact-section"
          aria-labelledby="contact-title"
        >
          <div className="contact-main">
            <span className="eyebrow">
              <span>09</span> START A CONVERSATION
            </span>
            <h2 id="contact-title">
              Good work starts
              <br />
              with a conversation<span className="accent">.</span>
            </h2>
            <p>
              For early-career opportunities, technical conversations,
              <br className="desktop-break" /> or a project worth building
              together.
            </p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={28} />
            </a>
            <div className="contact-actions">
              <button className="text-link copy-button" onClick={copyEmail}>
                {copyState === "Email copied" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                <span aria-live="polite">{copyState}</span>
              </button>
              <a
                className="text-link"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} /> GitHub <ArrowUpRight size={15} />
              </a>
              {profile.linkedin && (
                <a
                  className="text-link"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <ArrowUpRight size={15} />
                </a>
              )}
              <a className="text-link" href={`tel:${profile.phone}`}>
                <Phone size={16} />
                {profile.phone}
              </a>
            </div>
            <div className="cv-note">
              <FileText size={17} />
              {profile.cv ? (
                <a href="#cv" className="text-link">
                  View my CV <ArrowDown size={15} />
                </a>
              ) : (
                <span>
                  A reviewed technical CV will be added here when available.
                </span>
              )}
            </div>
          </div>
          <div className="contact-mark" aria-hidden="true">
            Z<span>!</span>
          </div>
          {profile.cv && <CvPreview src={asset(profile.cv)} name={profile.name} />}
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <Brand />
          <span>
            © {new Date().getFullYear()} {profile.name}
            <br />
            <span className="footer-sub">
              Made with curiosity. Built with AI assistance.
            </span>
          </span>
          <div className="footer-controls">
            <button
              className="text-link motion-button"
              disabled={systemReduced}
              aria-pressed={reduced || systemReduced}
              onClick={() => setReduced(!reduced)}
            >
              <Waves size={15} />
              {systemReduced
                ? "Reduced motion · system"
                : reduced
                  ? "Motion off"
                  : "Motion on"}
            </button>
            <a href="#top" className="text-link">
              Back to top <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </footer>
      <ArticleDialog article={article} onClose={closeArticle} />
    </>
  );
}
