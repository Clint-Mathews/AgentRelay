import { useState } from 'react'
import { LIMITS } from '../../../shared/limits'
import Icon from './Icon'

export default function SettingsDialog(): React.JSX.Element {
  const [showKey, setShowKey] = useState(false)
  const [remember, setRemember] = useState(false)
  const [notice, setNotice] = useState('')
  return (
    <div className="settings-page">
      <header className="page-heading">
        <h1>Settings</h1>
        <p>Choose the model your agents will use.</p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setNotice('Preview only — configuration was not saved.')
        }}
        onChange={() => setNotice('')}
      >
        <div className="settings-fields">
          <div className="field">
            <label htmlFor="model-id">Model ID</label>
            <input
              id="model-id"
              placeholder="provider/model-name"
              maxLength={LIMITS.modelId.max}
              aria-describedby="model-help"
            />
            <p id="model-help" className="field-help">
              Use an OpenRouter model with structured output. Maximum 200 characters.
            </p>
          </div>
          <div className="field">
            <label htmlFor="api-key">OpenRouter API key</label>
            <div className="password-field">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="Dummy key for preview"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="icon-button"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                aria-pressed={showKey}
                onClick={() => setShowKey(!showKey)}
              >
                <Icon name="eye" size={18} />
              </button>
            </div>
            <p className="field-help">
              Use a dummy value. This preview does not connect to OpenRouter.
            </p>
          </div>
        </div>
        <details className="advanced-settings">
          <summary>Advanced settings</summary>
          <div className="settings-fields">
            <div className="field">
              <label htmlFor="token-cap">Output tokens per call</label>
              <input
                id="token-cap"
                type="number"
                min={LIMITS.outputTokens.min}
                max={LIMITS.outputTokens.max}
                step={1}
                defaultValue={LIMITS.outputTokens.default}
              />
              <p className="field-help">256–8,192 · Default 2,048</p>
            </div>
            <label className="toggle-row">
              <span>Remember key on this device</span>
              <input
                className="switch"
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
            </label>
            <div>
              <h2>Application limits</h2>
              <dl className="limits-list">
                <div>
                  <dt>Task</dt>
                  <dd>4,000 characters</dd>
                </div>
                <div>
                  <dt>Sources</dt>
                  <dd>1–5 records</dd>
                </div>
                <div>
                  <dt>Excerpt per source</dt>
                  <dd>12,000 characters</dd>
                </div>
                <div>
                  <dt>Combined excerpts</dt>
                  <dd>30,000 characters</dd>
                </div>
                <div>
                  <dt>Message or artifact</dt>
                  <dd>32,000 characters</dd>
                </div>
                <div>
                  <dt>HTTP response</dt>
                  <dd>1 MiB</dd>
                </div>
                <div>
                  <dt>Run JSON</dt>
                  <dd>10 MiB</dd>
                </div>
              </dl>
              <p className="field-help">
                These are application limits. Smaller-context models may still reject a request.
              </p>
            </div>
            <div>
              <h2>Data sharing</h2>
              <p className="field-help">
                When connected, tasks, excerpts, and conversation context go to OpenRouter and the
                selected provider. Cancelling may not prevent charges for work already processed.
              </p>
            </div>
          </div>
        </details>
        <footer className="settings-footer">
          <p role="status">{notice}</p>
          <button className="button primary" type="submit">
            Preview save
          </button>
        </footer>
      </form>
    </div>
  )
}
