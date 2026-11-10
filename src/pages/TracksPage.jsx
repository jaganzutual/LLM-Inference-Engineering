import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tracks } from '../data/tracks.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import TrackCard from '../components/TrackCard.jsx';

const steps = [
  {
    number: '01',
    title: 'Pick a track',
    copy: 'Start with foundations, inference, or GPU performance. Each track stands on its own.',
  },
  {
    number: '02',
    title: 'Read and watch',
    copy: 'Work through written notes and walkthroughs at your own pace.',
  },
  {
    number: '03',
    title: 'Go at your pace',
    copy: 'Work through the topics in order, or jump straight to the one you need.',
  },
];

export default function TracksPage() {
  useDocumentTitle('Tracks — Inference Engineering');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId) return undefined;

    let cancelled = false;
    let timer;

    const scroll = () => {
      if (cancelled) return;
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navigate('/tracks', { replace: true, state: null });
    };

    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(scroll, 150);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [location.state, navigate]);

  return (
    <div className="landing-page tracks-page">
      <section className="tracks-hero">
        <p className="eyebrow">
          <span className="eyebrow-dot" /> The tracks
        </p>
        <h1>Choose a track.</h1>
        <p className="lead">
          Three self-contained sequences across the inference stack. Pick the
          layer you need, or work through all three at your own pace.
        </p>
      </section>

      <section className="tracks-grid" aria-label="Learning tracks">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </section>

      <p className="tracks-note">
        More advanced tracks — serving, kernels, and distributed inference — are
        in development.
      </p>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>A simple way to learn.</h2>
          </div>
          <p>
            Every track follows the same rhythm: pick it up, work through it,
            and move at your own pace.
          </p>
        </div>

        <div className="how-grid">
          {steps.map((step) => (
            <div className="how-step" key={step.number}>
              <span className="how-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
