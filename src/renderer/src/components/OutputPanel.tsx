import type { PreviewStage } from './preview'

export default function OutputPanel({ stage }: { stage: PreviewStage }): React.JSX.Element {
  return (
    <section className="output-panel" aria-labelledby="output-title">
      <article className="answer-content">
        <h2 id="output-title">Start with the local-first requirements.</h2>
        <p>
          Evaluate an embedded database for the prototype. Offline use and single-device storage are
          explicit requirements <span className="citation">S1</span>, and the engineering notes
          favor a small operational footprint <span className="citation">S2</span>.
        </p>
        <h3>What still needs checking</h3>
        <p>
          The supplied evidence contains no benchmark results. Test write throughput and concurrent
          editing before making a production decision.
        </p>
        {stage !== 'complete' && (
          <p className="answer-footnote">Working draft · Awaiting final review.</p>
        )}
      </article>
    </section>
  )
}
