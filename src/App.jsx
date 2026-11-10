import React, { useEffect, useState } from 'react';
import topics from '../topics.json';
import '../styles.css';

const phases = [
  { title: 'Deep Learning & LLM Foundations', start: 1, end: 25, tag: 'Foundations' },
  { title: 'LLM Inference Fundamentals', start: 26, end: 48, tag: 'Foundations' },
  { title: 'GPU Architecture & Performance', start: 49, end: 65, tag: 'Hardware' },
  { title: 'Inference Serving & Runtime Engineering', start: 66, end: 92, tag: 'Serving' },
  { title: 'Production Inference Infrastructure', start: 93, end: 104, tag: 'Production' },
  { title: 'CUDA & Triton Kernel Engineering', start: 105, end: 120, tag: 'Kernels' },
  { title: 'Advanced Inference Optimization', start: 121, end: 134, tag: 'Optimization' },
  { title: 'Multi-GPU & Distributed Inference', start: 135, end: 148, tag: 'Scaling' },
  { title: 'Compilers & Accelerator Programming', start: 149, end: 162, tag: 'Advanced' },
  { title: 'Frontier AI Infrastructure', start: 163, end: 180, tag: 'Advanced' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [stars, setStars] = useState(null);
  const [page, setPage] = useState(() => typeof window === 'undefined' ? '' : window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash);
      setQuery('');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const route = /^#\/phase\/([1-4])$/.exec(page);
  const selectedPhase = route ? Number(route[1]) - 1 : null;
  const isAgentPage = selectedPhase === 3;
  const startingPoints = [...phases.slice(0, 3), { title: 'Agent' }];

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/repos/jaganzutual/LLM-Inference-Engineering', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('GitHub star count unavailable');
        return response.json();
      })
      .then(data => {
        if (Number.isInteger(data.stargazers_count) && data.stargazers_count >= 0) setStars(data.stargazers_count);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const term = query.trim().toLowerCase();
  const filteredPhases = phases.map((phase, index) => ({
    phase, index,
    matches: topics.filter(topic => topic.number >= phase.start && topic.number <= phase.end &&
      (!term || topic.title.toLowerCase().includes(term) || phase.title.toLowerCase().includes(term)))
  })).filter(({ index, matches }) => matches.length > 0 && (selectedPhase === null || index === selectedPhase));
  return (<>
<header className="header"><div className="nav wrap"><a className="brand" href="#/" aria-label="Inference Engineering home"><span className="brand-icon"><i></i><i></i><i></i><i></i></span><span>inference<span className="brand-light">.engineering</span></span></a><nav aria-label="Choose a starting topic" className="phase-nav">{startingPoints.map((phase, index) => <a href={`#/phase/${index + 1}`} key={phase.title} aria-current={selectedPhase === index ? 'page' : undefined}><span className="nav-phase-number">{String(index + 1).padStart(2, '0')}</span><span className="nav-phase-title">{phase.title}<small>{index === 3 ? 'Coming soon' : `${phase.end - phase.start + 1} topics`}</small></span></a>)}</nav><a className="github" href="https://github.com/jaganzutual/LLM-Inference-Engineering" target="_blank" rel="noreferrer">View on GitHub {stars !== null && <span className="github-stars" aria-label={`${stars} GitHub stars`}><span aria-hidden="true">★</span> {stars.toLocaleString()}</span>} <span aria-hidden="true">↗</span></a></div></header>
<main id="top">{selectedPhase === null && <><section className="hero wrap"><div className="hero-copy"><div className="pill"><span className="pulse"></span> An open learning journey</div><h1>Understand LLMs<br /><span>from the inside out.</span></h1><p>A clear, ordered roadmap for learning how language models run.</p><div className="hero-actions"><a className="button primary" href="#roadmap">Explore the learning path <span>↗</span></a></div><div className="hero-stats"><div><strong>10</strong><span>learning phases</span></div><div><strong>180</strong><span>topics to explore</span></div><div><strong>∞</strong><span>things to discover</span></div></div></div><div className="hero-art" aria-label="Learning roadmap preview"><div className="art-top"><span><span className="tiny-dot"></span> THE LEARNING PATH</span><span>✳</span></div><div className="art-flow"><div className="flow-label">START WITH THE FOUNDATIONS</div><div className="model-box"><div className="model-icon">01</div><div><strong>Deep Learning &amp; LLM Foundations</strong><small>25 topics</small></div></div><div className="flow-line"></div><div className="model-box"><div className="model-icon">02</div><div><strong>LLM Inference Fundamentals</strong><small>23 topics</small></div></div><div className="flow-line"></div><div className="model-box"><div className="model-icon">03</div><div><strong>GPU Architecture &amp; Performance</strong><small>17 topics</small></div></div></div><div className="art-bottom"><span><span className="green-dot"></span> 10 PHASES TO EXPLORE</span><span>↗</span></div></div></section>
<div className="ticker"><div className="wrap ticker-inner"><span>FOLLOW THE SIGNAL</span><b>Transformers</b><i>✳</i><b>GPU performance</b><i>✳</i><b>Serving systems</b><i>✳</i><b>Optimization</b><i>✳</i><b>Distributed inference</b></div></div></>}
<section className="roadmap-section" id="roadmap"><div className="wrap"><div className="roadmap-toolbar"><div>{selectedPhase !== null && <a className="back-link" href="#/">← All phases</a>}<strong>{selectedPhase === null ? 'Explore the curriculum' : isAgentPage ? 'Agent' : phases[selectedPhase].title}</strong><span>{selectedPhase === null ? '10 phases · 180 topics' : isAgentPage ? 'Coming soon' : `${phases[selectedPhase].end - phases[selectedPhase].start + 1} topics`}</span></div>{!isAgentPage && <label className="search"><span>⌕</span><input id="search" type="search" placeholder="Search topics..." aria-label="Search topics" value={query} onChange={(event) => setQuery(event.target.value)} /></label>}</div>{isAgentPage ? <p className="empty">Topics coming soon.</p> : <><div id="phases" className="phases">{filteredPhases.map(({ phase, index, matches }) => <details id={`phase-${index + 1}`} className="phase" key={phase.title} open={selectedPhase !== null || query.trim() ? true : undefined}><summary><span className="phase-number">{String(index + 1).padStart(2, '0')}</span><span className="phase-info"><strong>{phase.title}</strong></span><span className="phase-tag">{phase.tag}</span><span className="phase-count">{phase.end - phase.start + 1} topics</span><span className="expand" aria-hidden="true">+</span></summary><ol className="topic-list">{matches.map(topic => <li key={topic.number}><span>{String(topic.number).padStart(3, '0')}</span><span>{topic.title}</span></li>)}</ol></details>)}</div>{filteredPhases.length === 0 && <p className="empty">No topics found. Try another search.</p>}</>}</div></section>
</main><footer><div className="wrap footer-inner"><a className="brand" href="#/"><span className="brand-icon"><i></i><i></i><i></i><i></i></span><span>inference<span className="brand-light">.engineering</span></span></a><p>Learning how LLMs work, together.</p><a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a></div></footer>
</>);
}
