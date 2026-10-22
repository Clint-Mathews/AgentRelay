import { useRef, useState } from 'react'
import { LIMITS } from '../../../shared/limits'
import Icon from './Icon'
import { previewSources, previewTask } from './preview'

type SourceDraft = { key: string; title: string; url: string; excerpt: string }
const emptySource = (key: string): SourceDraft => ({ key, title: '', url: '', excerpt: '' })
const count = (value: number): string => value.toLocaleString('en-US')

export default function TaskComposer({ onPreview }: { onPreview: () => void }): React.JSX.Element {
  const [task, setTask] = useState('')
  const [sources, setSources] = useState<SourceDraft[]>([emptySource('source-0')])
  const [expanded, setExpanded] = useState<string | null>('source-0')
  const nextKey = useRef(1)
  const total = sources.reduce((sum, source) => sum + source.excerpt.length, 0)
  const update = (key: string, field: keyof Omit<SourceDraft, 'key'>, value: string): void => {
    setSources((current) =>
      current.map((source) => (source.key === key ? { ...source, [field]: value } : source))
    )
  }
  const addSource = (): void => {
    const key = `source-${nextKey.current++}`
    setSources((current) => [...current, emptySource(key)])
    setExpanded(key)
    requestAnimationFrame(() => document.getElementById(`${key}-title`)?.focus())
  }

  return (
    <div className="composer-page">
      <header className="page-heading">
        <h1>What would you like to explore?</h1>
        <p>Ask a question and add the text your agents should work with.</p>
      </header>
      <section className="task-section" aria-labelledby="task-label">
        <div className="section-heading">
          <label id="task-label" htmlFor="task">
            Your task
          </label>
          <span className="counter">
            {count(task.trim().length)} / {count(LIMITS.task.max)}
          </span>
        </div>
        <textarea
          id="task"
          className="task-input"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="e.g. Which approach is right for our project?"
          rows={3}
        />
      </section>
      <section className="sources-section" aria-labelledby="sources-title">
        <div className="section-heading">
          <h2 id="sources-title">
            Sources{' '}
            <span className="muted">
              {sources.length} / {LIMITS.sources.max}
            </span>
          </h2>
          <button
            className="text-button"
            disabled={sources.length >= LIMITS.sources.max}
            onClick={addSource}
          >
            <Icon name="plus" size={15} /> Add source
          </button>
        </div>
        <div className="source-list">
          {sources.map((source, index) => (
            <section className="source-editor" key={source.key} aria-label={`Source ${index + 1}`}>
              <div className="source-editor-heading">
                <button
                  id={`${source.key}-toggle`}
                  className="source-toggle"
                  aria-expanded={expanded === source.key}
                  aria-controls={`${source.key}-fields`}
                  onClick={() => setExpanded(expanded === source.key ? null : source.key)}
                >
                  <Icon name="chevron" size={15} />
                  <span>{source.title || `Source ${index + 1}`}</span>
                </button>
                {sources.length > 1 && (
                  <button
                    className="icon-button"
                    aria-label={`Remove source ${index + 1}`}
                    onClick={() => {
                      setSources((current) => current.filter((item) => item.key !== source.key))
                      const remaining = sources.find((item) => item.key !== source.key)!
                      if (expanded === source.key) setExpanded(remaining.key)
                      requestAnimationFrame(() =>
                        document.getElementById(`${remaining.key}-toggle`)?.focus()
                      )
                    }}
                  >
                    <Icon name="close" size={15} />
                  </button>
                )}
              </div>
              <div
                id={`${source.key}-fields`}
                className="source-fields"
                hidden={expanded !== source.key}
              >
                <div className="field">
                  <label htmlFor={`${source.key}-title`}>Title</label>
                  <input
                    id={`${source.key}-title`}
                    value={source.title}
                    onChange={(event) => update(source.key, 'title', event.target.value)}
                    placeholder="e.g. Project notes"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${source.key}-excerpt`}>
                    Pasted text{' '}
                    <span className="counter">
                      {count(source.excerpt.length)} / {count(LIMITS.excerpt.maxPerSource)}
                    </span>
                  </label>
                  <textarea
                    id={`${source.key}-excerpt`}
                    value={source.excerpt}
                    onChange={(event) => update(source.key, 'excerpt', event.target.value)}
                    placeholder="Paste a relevant passage here…"
                    rows={3}
                  />
                </div>
                <details className="source-url">
                  <summary>
                    Reference URL <span>Optional</span>
                  </summary>
                  <div className="field">
                    <label htmlFor={`${source.key}-url`}>HTTP/HTTPS URL</label>
                    <input
                      id={`${source.key}-url`}
                      type="url"
                      value={source.url}
                      onChange={(event) => update(source.key, 'url', event.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </details>
              </div>
            </section>
          ))}
        </div>
        <details className="input-guidance">
          <summary>Source guidelines & limits</summary>
          <div>
            <p>
              URLs are references only. Paste the relevant text; AgentRelay does not fetch pages.
            </p>
            <p>
              Include at least one non-empty excerpt. URL-only sources cannot support claims about
              unseen content.
            </p>
            <p>
              Task: 1–4,000 characters after trimming. Titles: 1–200 characters. URLs: up to 2,048
              characters.
            </p>
            <p className="counter">
              Combined excerpts: {count(total)} / {count(LIMITS.excerpt.maxTotal)} characters.
            </p>
          </div>
        </details>
      </section>
      <footer className="composer-footer">
        <button
          className="text-button"
          onClick={() => {
            setTask(previewTask)
            setSources(previewSources.map((source) => ({ ...source })))
            setExpanded(previewSources[0].key)
          }}
        >
          Use a sample task
        </button>
        <button className="button primary" onClick={onPreview}>
          View example run <Icon name="arrow" size={16} />
        </button>
      </footer>
      <p className="preview-caption">Opens a fixed example, not a run of your task.</p>
    </div>
  )
}
