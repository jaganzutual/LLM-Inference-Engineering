import rawTopics from '../../topics.json';

/**
 * The curriculum is the single source of truth for the app.
 * Topics live in topics.json; phase boundaries and presentation metadata live here.
 */
const phaseDefinitions = [
  {
    id: 1,
    title: 'Deep Learning & LLM Foundations',
    tag: 'Foundations',
    description:
      'Tensors, autograd, transformer internals, and the mechanics behind modern language models.',
    start: 1,
    end: 25,
  },
  {
    id: 2,
    title: 'LLM Inference Fundamentals',
    tag: 'Foundations',
    description:
      'Decoding, KV caches, batching, sampling, and the vocabulary of inference performance.',
    start: 26,
    end: 48,
  },
  {
    id: 3,
    title: 'GPU Architecture & Performance',
    tag: 'Hardware',
    description:
      'How GPUs execute work: memory hierarchy, occupancy, coalescing, and profiling.',
    start: 49,
    end: 65,
  },
  {
    id: 4,
    title: 'Inference Serving & Runtime Engineering',
    tag: 'Serving',
    description:
      'Build and operate serving paths with vLLM, SGLang, scheduling, and streaming.',
    start: 66,
    end: 92,
  },
  {
    id: 5,
    title: 'Production Inference Infrastructure',
    tag: 'Production',
    description:
      'Deployments, observability, autoscaling, reliability, and cost control in production.',
    start: 93,
    end: 104,
  },
  {
    id: 6,
    title: 'CUDA & Triton Kernel Engineering',
    tag: 'Kernels',
    description:
      'Write, inspect, and optimize the kernels underneath inference workloads.',
    start: 105,
    end: 120,
  },
  {
    id: 7,
    title: 'Advanced Inference Optimization',
    tag: 'Optimization',
    description:
      'Quantization, speculative decoding, parallelism, and architecture-specific tuning.',
    start: 121,
    end: 134,
  },
  {
    id: 8,
    title: 'Multi-GPU & Distributed Inference',
    tag: 'Scaling',
    description:
      'Tensor, pipeline, and expert parallelism; communication and scaling limits.',
    start: 135,
    end: 148,
  },
  {
    id: 9,
    title: 'Compilers & Accelerator Programming',
    tag: 'Compilers',
    description:
      'Graph compilation, IRs, fusion, and programming models for emerging accelerators.',
    start: 149,
    end: 162,
  },
  {
    id: 10,
    title: 'Frontier AI Infrastructure',
    tag: 'Frontier',
    description:
      'Long-context serving, disaggregation, agents, and the evolving systems stack.',
    start: 163,
    end: 180,
  },
];

export const allTopics = [...rawTopics].sort((a, b) => a.number - b.number);
export const totalTopics = allTopics.length;

export const phases = phaseDefinitions.map((phase) => ({
  ...phase,
  topics: allTopics.filter(
    (topic) => topic.number >= phase.start && topic.number <= phase.end,
  ),
}));

const coveredNumbers = phases.flatMap((phase) =>
  phase.topics.map((topic) => topic.number),
);

if (
  coveredNumbers.length !== totalTopics ||
  new Set(coveredNumbers).size !== totalTopics
) {
  throw new Error('Phase ranges must cover every topic exactly once.');
}

export const phaseById = (id) =>
  phases.find((phase) => phase.id === Number(id)) ?? null;

export const topicByNumber = (number) =>
  allTopics.find((topic) => topic.number === Number(number)) ?? null;

export const phaseForTopic = (number) => {
  const numeric = Number(number);
  return (
    phases.find((phase) =>
      phase.topics.some((topic) => topic.number === numeric),
    ) ?? null
  );
};

export const topicPath = (number) => `/topic/${number}`;
export const phasePath = (id) => `/phase/${id}`;
