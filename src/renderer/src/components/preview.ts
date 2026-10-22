// Renderer-only illustrative content. Nothing here is sent to main or a provider.
export type PreviewStage = 'review' | 'complete'
export type AgentRole = 'Orchestrator' | 'Researcher' | 'Reviewer'

// Simulated relay timeline: each message is composed by its sender, then delivered.
export type RelayPhase =
  | { kind: 'idle' }
  | { kind: 'composing'; index: number }
  | { kind: 'transit'; index: number }
  | { kind: 'done' }

export const initialPhase: RelayPhase = { kind: 'idle' }

export function nextPhase(phase: RelayPhase): RelayPhase {
  const last = previewMessages.length - 1
  if (phase.kind === 'idle') return { kind: 'composing', index: 0 }
  if (phase.kind === 'composing') return { kind: 'transit', index: phase.index }
  if (phase.kind === 'transit')
    return phase.index < last ? { kind: 'composing', index: phase.index + 1 } : { kind: 'done' }
  return phase
}

export function phaseDuration(phase: RelayPhase): number {
  if (phase.kind === 'idle') return 600
  return phase.kind === 'composing' ? 1400 : 1100
}

export function deliveredCount(phase: RelayPhase): number {
  if (phase.kind === 'done') return previewMessages.length
  if (phase.kind === 'composing') return phase.index
  if (phase.kind === 'transit') return phase.index
  return 0
}

const VERBS = [
  'Framing the task',
  'Drafting an answer',
  'Questioning the draft',
  'Answering the reviewer',
  'Finalizing the review'
]
const STEPS = [0, 1, 2, 2, 3]

export function activeStep(phase: RelayPhase): number {
  if (phase.kind === 'done') return 5
  if (phase.kind === 'composing' || phase.kind === 'transit') return STEPS[phase.index]
  return 0
}

export function phaseStatus(phase: RelayPhase): string {
  if (phase.kind === 'idle') return 'Starting the relay…'
  if (phase.kind === 'done') return 'Run complete'
  const message = previewMessages[phase.index]
  if (phase.kind === 'composing') return `${message.from} is ${VERBS[phase.index].toLowerCase()}…`
  return `Delivering the ${message.kind.toLowerCase()} to ${message.to}…`
}

export function liveActivity(phase: RelayPhase): { from: AgentRole; text: string } | null {
  if (phase.kind === 'composing')
    return { from: previewMessages[phase.index].from, text: `${VERBS[phase.index]}…` }
  if (phase.kind === 'transit')
    return {
      from: previewMessages[phase.index].from,
      text: `Sending to ${previewMessages[phase.index].to}…`
    }
  return null
}

export const previewTask = 'Which database should we use for a local-first research tool?'
export const previewSources = [
  {
    key: 'sample-a',
    title: 'Product requirements · sample',
    url: '',
    excerpt:
      'The prototype runs on one device, must work offline, and stores research notes with their source references. Team collaboration is outside the first release.'
  },
  {
    key: 'sample-b',
    title: 'Engineering notes · sample',
    url: '',
    excerpt:
      'Prefer a small operational footprint. We have not measured write throughput or tested concurrent editing. Benchmarking is required before choosing for production.'
  }
]

export const previewMessages: {
  id: number
  from: AgentRole
  to: AgentRole
  kind: string
  time: string
  text: string
  replyTo?: number
}[] = [
  {
    id: 1,
    from: 'Orchestrator',
    to: 'Researcher',
    kind: 'Assignment',
    time: '00:02',
    text: 'Compare options against the offline, single-device requirements. Use S1 and S2, and call out anything the excerpts do not establish.'
  },
  {
    id: 2,
    from: 'Researcher',
    to: 'Reviewer',
    kind: 'Draft',
    time: '00:18',
    text: 'Evaluate an embedded database first. The prototype is local and single-device [S1], with a preference for low operational overhead [S2]. Performance remains unverified.'
  },
  {
    id: 3,
    from: 'Reviewer',
    to: 'Researcher',
    kind: 'Clarification',
    time: '00:31',
    text: 'Do we have evidence about concurrent writes? Keep the recommendation conditional if there are no benchmark results.',
    replyTo: 2
  },
  {
    id: 4,
    from: 'Researcher',
    to: 'Reviewer',
    kind: 'Answer',
    time: '00:43',
    text: 'No. The supplied notes explicitly say throughput and concurrent editing have not been tested [S2]. I have added that limitation to the recommendation.',
    replyTo: 3
  },
  {
    id: 5,
    from: 'Reviewer',
    to: 'Orchestrator',
    kind: 'Review',
    time: '00:58',
    text: 'Approved with the benchmark limitation retained. The recommendation is a prototype direction, not a performance guarantee.',
    replyTo: 4
  }
]
