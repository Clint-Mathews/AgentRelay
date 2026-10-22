import { useEffect, useRef } from 'react'
import Icon from './Icon'
import { previewMessages, liveActivity, type AgentRole, type RelayPhase } from './preview'

export default function MessageTimeline({
  phase,
  delivered,
  selected,
  onSelect
}: {
  phase: RelayPhase
  delivered: number
  selected: AgentRole | null
  onSelect: (role: AgentRole | null) => void
}): React.JSX.Element {
  const listRef = useRef<HTMLOListElement>(null)
  const messages = previewMessages
    .slice(0, delivered)
    .filter((message) => !selected || message.from === selected || message.to === selected)
  const activity = liveActivity(phase)
  const visibleActivity = activity && (!selected || activity.from === selected) ? activity : null

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [delivered, selected])

  return (
    <section className="panel timeline-panel" aria-labelledby="messages-title">
      <div className="panel-heading">
        <h2 id="messages-title">Conversation</h2>
        <span className="count-tag">{messages.length} delivered</span>
      </div>
      <div className="timeline-filter">
        <label htmlFor="agent-filter">Exchanges</label>
        <select
          id="agent-filter"
          value={selected ?? ''}
          onChange={(event) =>
            onSelect(event.target.value ? (event.target.value as AgentRole) : null)
          }
        >
          <option value="">All agents</option>
          {(['Orchestrator', 'Researcher', 'Reviewer'] as const).map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>
      <ol className="message-list" ref={listRef}>
        {messages.map((message) => (
          <li key={message.id} id={`message-${message.id}`} tabIndex={-1}>
            <div className="message-meta">
              <span>{message.kind}</span>
              <time>{message.time}</time>
            </div>
            <h3>
              {message.from}
              <Icon name="arrow" size={13} />
              {message.to}
            </h3>
            <p>{message.text}</p>
            <div className="message-footer">
              <span>
                <Icon name="check" size={12} /> Delivered · #{message.id}
              </span>
              {message.replyTo && (
                <button
                  className="text-button"
                  onClick={() => {
                    onSelect(null)
                    requestAnimationFrame(() => {
                      document.getElementById(`message-${message.replyTo}`)?.focus()
                    })
                  }}
                >
                  Reply to #{message.replyTo}
                </button>
              )}
            </div>
          </li>
        ))}
        {visibleActivity && (
          <li className="live-row" aria-hidden="true">
            <span className="status-dot solid pulse" />
            <strong>{visibleActivity.from}</strong>
            <span>{visibleActivity.text}</span>
          </li>
        )}
      </ol>
    </section>
  )
}
