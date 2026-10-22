import { useEffect, useRef, useState } from 'react'
import AgentGraph from './AgentGraph'
import MessageTimeline from './MessageTimeline'
import OutputPanel from './OutputPanel'
import ProgressSteps from './ProgressSteps'
import RunToolbar from './RunToolbar'
import {
  initialPhase,
  nextPhase,
  phaseDuration,
  deliveredCount,
  previewSources,
  previewTask,
  type AgentRole,
  type RelayPhase
} from './preview'

type View = 'answer' | 'activity' | 'sources'

export default function RunWorkspace({ onBack }: { onBack: () => void }): React.JSX.Element {
  const [phase, setPhase] = useState<RelayPhase>(initialPhase)
  const [playing, setPlaying] = useState(true)
  const [selected, setSelected] = useState<AgentRole | null>(null)
  const [view, setView] = useState<View>('activity')
  const touchedView = useRef(false)

  useEffect(() => {
    if (!playing || phase.kind === 'done') return
    const timer = setTimeout(() => setPhase(nextPhase(phase)), phaseDuration(phase))
    return () => clearTimeout(timer)
  }, [phase, playing])

  useEffect(() => {
    if (phase.kind === 'done' && !touchedView.current) setView('answer')
  }, [phase])

  const delivered = deliveredCount(phase)
  const changeView = (next: View): void => {
    touchedView.current = true
    setView(next)
  }

  return (
    <div className="workspace-page">
      <RunToolbar
        phase={phase}
        playing={playing}
        onTogglePlay={() => setPlaying(!playing)}
        onRestart={() => {
          setPhase(initialPhase)
          setPlaying(true)
        }}
        onBack={onBack}
      />
      <div className="view-navigation" aria-label="Run views">
        {(['answer', 'activity', 'sources'] as const).map((item) => (
          <button
            key={item}
            aria-pressed={view === item}
            aria-controls="run-view"
            onClick={() => changeView(item)}
          >
            {item === 'answer'
              ? 'Answer'
              : item === 'activity'
                ? 'Agent activity'
                : 'Task & sources'}
          </button>
        ))}
      </div>
      <div id="run-view">
        {view === 'answer' && <OutputPanel stage={phase.kind === 'done' ? 'complete' : 'review'} />}
        {view === 'activity' && (
          <div className="activity-view">
            <ProgressSteps phase={phase} />
            <AgentGraph
              phase={phase}
              delivered={delivered}
              selected={selected}
              onSelect={setSelected}
            />
            <MessageTimeline
              phase={phase}
              delivered={delivered}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        )}
        {view === 'sources' && (
          <section className="run-sources">
            <h2>Original task</h2>
            <p>{previewTask}</p>
            <h2>Sources</h2>
            {previewSources.map((source, index) => (
              <article key={source.key}>
                <h3>
                  <span className="citation">S{index + 1}</span> {source.title}
                </h3>
                <p>{source.excerpt}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
