import { ArrowUpRight, GitBranch, Layers3, Network } from 'lucide-react';

export default function ProjectVisual({ kind }: { kind: string }) {
  return <div className={`project-visual ${kind}`} aria-hidden="true">
    {kind === 'roadmap' ? <>
      <div className="mini-plan">
        <div className="plan-head"><Network size={17}/><span>CCNA / STUDY MAP</span><span className="plan-dots"><i/><i/><i/></span></div>
        <div className="plan-body"><div className="plan-side"><i/><i/><i/><i/></div><div className="plan-content"><span className="plan-label">STRUCTURE FOR THE JOURNEY</span><strong>One topic at a time.</strong><div className="plan-track"><span>01<br/><small>LEARN</small></span><i/><span>02<br/><small>PRACTICE</small></span><i/><span>03<br/><small>REVIEW</small></span></div><div className="plan-lines"><i/><i/><i/></div></div></div>
      </div><span className="visual-stamp">LEARNING TOOL / PUBLIC SOURCE</span>
    </> : <>
      <div className="mini-site"><div className="mini-nav"><b>Z<span>!</span>DVN</b><div><i/><i/><i/></div></div><div className="mini-cover"><div><span className="plan-label">CYBERSECURITY & ENGINEERING</span><strong>Understand<br/>systems.<br/><em>Build with intent.</em></strong><span className="mini-cta">EXPLORE THE WORK <ArrowUpRight size={10}/></span></div><div className="mini-orbit"><Layers3 size={30}/><i/><i/></div></div></div><span className="visual-stamp"><GitBranch size={12}/> STATIC BY DESIGN / CONTENT FIRST</span>
    </>}
  </div>;
}
