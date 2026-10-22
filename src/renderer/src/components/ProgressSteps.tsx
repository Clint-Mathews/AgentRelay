import Icon from './Icon'
import { activeStep, type RelayPhase } from './preview'

export default function ProgressSteps({ phase }: { phase: RelayPhase }): React.JSX.Element {
  const active = activeStep(phase)
  return (
    <ol className="progress-steps" aria-label="Example run progress">
      {['Assign', 'Research', 'Review', 'Synthesize', 'Complete'].map((step, index) => (
        <li
          key={step}
          className={index < active ? 'finished' : index === active ? 'current' : ''}
          aria-current={index === active ? 'step' : undefined}
        >
          <span className="step-symbol">
            {index < active ? <Icon name="check" size={13} /> : index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}
