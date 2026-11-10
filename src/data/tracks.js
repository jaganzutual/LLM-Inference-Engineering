import { phases } from './curriculum.js';

/**
 * The landing page exposes focused tracks. Each track is one of the
 * curriculum phases, so topics, counts, and content stay in sync.
 *
 * The remaining phases stay in curriculum.js for future tracks. Add their
 * ids to this list when they are ready to be published.
 */
const trackMeta = [
  {
    id: 1,
    shortTitle: 'Foundations',
    level: 'Start here',
    tag: 'Foundations',
    summary:
      'Build the mental model behind modern LLMs — tensors, gradients, attention, transformer blocks, and the training process.',
    outcomes: [
      'Work fluently with tensors, shapes, and autograd',
      'Read transformer internals with confidence',
      'Understand how pretraining produces a language model',
    ],
  },
  {
    id: 2,
    shortTitle: 'Inference',
    level: 'Core systems',
    tag: 'Inference',
    summary:
      'Follow a request through an inference engine — decoding, KV caches, batching, sampling, and the metrics that matter.',
    outcomes: [
      'Explain prefill versus decode',
      'Reason about KV cache and batching trade-offs',
      'Measure latency, throughput, and utilization',
    ],
  },
  {
    id: 3,
    shortTitle: 'GPU Performance',
    level: 'Hardware',
    tag: 'Hardware',
    summary:
      'See what the GPU is actually doing — memory hierarchy, occupancy, coalescing, tensor cores, and profiling.',
    outcomes: [
      'Map work to streaming multiprocessors and memory',
      'Diagnose coalescing, occupancy, and latency issues',
      'Profile kernels with real GPU tools',
    ],
  },
];

export const tracks = trackMeta.map((meta) => {
  const phase = phases.find((item) => item.id === meta.id);

  if (!phase) {
    throw new Error(`Track ${meta.id} does not match a curriculum phase.`);
  }

  return {
    ...phase,
    ...meta,
    topics: phase.topics,
  };
});

export const trackTopics = tracks
  .flatMap((track) => track.topics)
  .sort((a, b) => a.number - b.number);

export const totalTrackTopics = trackTopics.length;

export const trackById = (id) =>
  tracks.find((track) => track.id === Number(id)) ?? null;

export const trackForTopic = (number) => {
  const numeric = Number(number);
  return (
    tracks.find((track) =>
      track.topics.some((topic) => topic.number === numeric),
    ) ?? null
  );
};

export const trackPath = (id) => `/track/${id}`;

export const trackTopicPath = (trackId, topicNumber) =>
  `/track/${trackId}/topic/${topicNumber}`;
