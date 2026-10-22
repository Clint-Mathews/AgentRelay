import Icon from './Icon'
import { phaseStatus, type RelayPhase } from './preview'

export default function RunToolbar({
  phase,
  playing,
  onTogglePlay,
  onRestart,
  onBack
}: {
  phase: RelayPhase
  playing: boolean
  onTogglePlay: () => void
  onRestart: () => void
  onBack: () => void
}): React.JSX.Element {
  const done = phase.kind === 'done'
  return (
    <>
      <div className="workspace-back">
        <button className="text-button" onClick={onBack}>
          <Icon name="back" size={15} /> Back to task
        </button>
        <span className="badge">Simulated example</span>
      </div>
      <header className="page-heading">
        <h1>A database for a local-first tool</h1>
        <p role="status">{phaseStatus(phase)}</p>
      </header>
      <div className="run-controls">
        {done ? (
          <span className="muted">Nothing left to deliver.</span>
        ) : (
          <button className="button secondary small" onClick={onTogglePlay}>
            <Icon name={playing ? 'pause' : 'play'} size={14} />
            {playing ? 'Pause' : 'Resume'}
          </button>
        )}
        <button className="text-button" onClick={onRestart}>
          <Icon name="history" size={15} /> Restart run
        </button>
      </div>
    </>
  )
}
