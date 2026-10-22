import { useState } from 'react'
import { RelayMark } from './components/Icon'
import RunHistory from './components/RunHistory'
import RunWorkspace from './components/RunWorkspace'
import SettingsDialog from './components/SettingsDialog'
import TaskComposer from './components/TaskComposer'

type Page = 'task' | 'workspace' | 'history' | 'settings'

export default function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>('task')
  const [taskKey, setTaskKey] = useState(0)
  const navigate = (next: Page): void => {
    setPage(next)
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    })
  }
  const newTask = (): void => {
    setTaskKey((key) => key + 1)
    navigate('task')
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app-header">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault()
            navigate('task')
          }}
        >
          <RelayMark />
          <span>AgentRelay</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button
            aria-current={page === 'task' ? 'page' : undefined}
            onClick={() => navigate('task')}
          >
            Task
          </button>
          <button
            aria-current={page === 'history' ? 'page' : undefined}
            onClick={() => navigate('history')}
          >
            History
          </button>
          <button
            aria-current={page === 'settings' ? 'page' : undefined}
            onClick={() => navigate('settings')}
          >
            Settings
          </button>
        </nav>
      </header>
      <main id="main-content" className="main-sheet" tabIndex={-1}>
        <div hidden={page !== 'task'}>
          <TaskComposer key={taskKey} onPreview={() => navigate('workspace')} />
        </div>
        {page === 'workspace' && <RunWorkspace onBack={() => navigate('task')} />}
        {page === 'history' && (
          <RunHistory onOpen={() => navigate('workspace')} onNewTask={newTask} />
        )}
        {page === 'settings' && <SettingsDialog />}
      </main>
      <footer className="app-footer">UI preview · Nothing is sent or saved.</footer>
    </div>
  )
}
