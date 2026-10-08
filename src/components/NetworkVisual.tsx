import { useState } from 'react';
import { ArrowUpRight, Code2, Cpu, Network, Shield } from 'lucide-react';
import { capabilities } from '../content';

const icons = [Shield, Network, Cpu, Code2];

export default function NetworkVisual() {
  const [selected, setSelected] = useState(0);
  const current = capabilities[selected];
  return <div className="system-visual">
    <div className="visual-heading"><span className="micro">A CONNECTED PERSPECTIVE</span><span className="micro visual-index">{current.index} / 04</span></div>
    <div className="network-field">
      <svg className="network-lines" viewBox="0 0 500 390" aria-hidden="true">
        <defs><radialGradient id="core-glow"><stop stopColor="#65f2d5" stopOpacity=".13"/><stop offset="1" stopColor="#65f2d5" stopOpacity="0"/></radialGradient></defs>
        <circle cx="250" cy="195" r="180" fill="url(#core-glow)"/>
        <g fill="none" stroke="#273846" strokeWidth="1">
          <circle cx="250" cy="195" r="105"/><circle cx="250" cy="195" r="150" strokeDasharray="2 7"/>
          <path d="M100 88H168L250 195M399 109H333L250 195M108 304H168L250 195M396 306H333L250 195"/>
          <path d="M250 20v22M250 348v22M72 195h22M406 195h22"/>
        </g>
        <circle className="orbit" cx="250" cy="195" r="124" fill="none" stroke="#65f2d5" strokeOpacity=".55" strokeWidth="1" strokeDasharray="40 740"/>
        <g fill="#65f2d5" opacity=".8"><circle cx="168" cy="88" r="2.5"/><circle cx="333" cy="109" r="2.5"/><circle cx="168" cy="304" r="2.5"/><circle cx="333" cy="306" r="2.5"/></g>
      </svg>
      <div className="network-core" aria-hidden="true"><span className="core-logo">Z<span>!</span></span><span className="micro">ZIDAN</span></div>
      {capabilities.map((capability, index) => {
        const Icon = icons[index];
        return <button key={capability.id} className={`network-node node-${index} ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`Explore ${capability.short}`}>
          <span className="node-symbol"><Icon size={20} strokeWidth={1.6}/></span>
          <span className="node-name">{capability.short}</span><span className="node-number">{capability.index}</span>
        </button>;
      })}
    </div>
    <div className="visual-caption" aria-live="polite"><div><span className="micro">{current.index} / {current.short.toUpperCase()}</span><p>{current.summary}</p></div><a href={`#capability-${current.id}`} aria-label={`Read about ${current.short}`}><ArrowUpRight size={21}/></a></div>
    <div className="visual-hint">Four interests. One connected practice.<span>Select a node to explore</span></div>
  </div>;
}
