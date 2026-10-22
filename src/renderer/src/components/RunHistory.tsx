import { useState } from 'react'
import Icon from './Icon'

export default function RunHistory({
  onOpen,
  onNewTask
}: {
  onOpen: () => void
  onNewTask: () => void
}): React.JSX.Element {
  const [search, setSearch] = useState('')
  const matches = 'A database for a local-first tool'.toLowerCase().includes(search.toLowerCase())
  return (
    <div className="history-page">
      <header className="page-heading heading-with-action">
        <div>
          <h1>History</h1>
          <p>No saved runs yet. Explore an example below.</p>
        </div>
        <button className="button primary" onClick={onNewTask}>
          <Icon name="plus" size={16} /> New task
        </button>
      </header>
      <div className="history-toolbar">
        <div className="search-field">
          <Icon name="search" size={17} />
          <input
            aria-label="Search example runs"
            placeholder="Search runs…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <span className="muted">{matches ? '1 example' : '0 results'}</span>
      </div>
      {matches ? (
        <button className="history-row" onClick={onOpen}>
          <div>
            <h2>A database for a local-first tool</h2>
            <p>Simulated example · 2 sources</p>
          </div>
          <Icon name="chevron" size={18} />
        </button>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={28} />
          <h2>No matching runs</h2>
          <p>Try another title or clear your search.</p>
          <button className="button secondary" onClick={() => setSearch('')}>
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
