import { useEffect } from 'react'
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Icon from './Icon'
import {
  previewMessages,
  liveActivity,
  initialPhase,
  type AgentRole,
  type RelayPhase
} from './preview'

type Tone = 'active' | 'done' | 'idle'
type AgentNodeData = {
  role: AgentRole
  icon: 'workflow' | 'search' | 'check'
  status: string
  tone: Tone
  dimmed: boolean
}
type AgentNodeType = Node<AgentNodeData, 'agent'>

const ROLES: { role: AgentRole; icon: AgentNodeData['icon'] }[] = [
  { role: 'Orchestrator', icon: 'workflow' },
  { role: 'Researcher', icon: 'search' },
  { role: 'Reviewer', icon: 'check' }
]

const NODE_POSITION: Record<AgentRole, { x: number; y: number }> = {
  Orchestrator: { x: 200, y: 12 },
  Researcher: { x: 16, y: 188 },
  Reviewer: { x: 384, y: 188 }
}

// One edge per simulated message, in delivery order. The three Researcher/Reviewer
// routes each get their own lane (top/middle/bottom) so paths never overlap.
const EDGE_DEFS = [
  {
    label: 'Assignment',
    source: 'Orchestrator',
    target: 'Researcher',
    sh: 's-bottom',
    th: 't-top'
  },
  { label: 'Draft', source: 'Researcher', target: 'Reviewer', sh: 's-lane-a', th: 't-lane-a' },
  {
    label: 'Clarification',
    source: 'Reviewer',
    target: 'Researcher',
    sh: 's-lane-m',
    th: 't-lane-m-r'
  },
  { label: 'Answer', source: 'Researcher', target: 'Reviewer', sh: 's-lane-b', th: 't-lane-b' },
  { label: 'Review', source: 'Reviewer', target: 'Orchestrator', sh: 's-top', th: 't-side-o' }
] as const

function deliveredIn(phase: RelayPhase): number {
  if (phase.kind === 'done') return previewMessages.length
  if (phase.kind === 'composing' || phase.kind === 'transit') return phase.index
  return 0
}

function statusFor(role: AgentRole, phase: RelayPhase): { status: string; tone: Tone } {
  if (phase.kind === 'done') return { status: 'Complete', tone: 'done' }
  if (phase.kind === 'composing' && previewMessages[phase.index].from === role)
    return { status: 'Working…', tone: 'active' }
  if (phase.kind === 'transit' && previewMessages[phase.index].to === role)
    return { status: 'Receiving…', tone: 'active' }
  const sent = previewMessages.some(
    (message, index) => message.from === role && index < deliveredIn(phase)
  )
  return { status: sent ? 'Delivered' : 'Waiting', tone: sent ? 'done' : 'idle' }
}

function AgentNode({ data }: NodeProps<AgentNodeType>): React.JSX.Element {
  return (
    <div className={`agent-card tone-${data.tone}${data.dimmed ? ' dimmed' : ''}`}>
      <Handle type="target" position={Position.Top} id="t-top" />
      <Handle type="target" position={Position.Right} id="t-side-o" />
      <Handle type="target" position={Position.Left} id="t-lane-a" style={{ top: '22%' }} />
      <Handle type="target" position={Position.Left} id="t-lane-m" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="t-lane-b" style={{ top: '78%' }} />
      <Handle type="target" position={Position.Right} id="t-lane-m-r" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom" />
      <Handle type="source" position={Position.Right} id="s-lane-a" style={{ top: '22%' }} />
      <Handle type="source" position={Position.Right} id="s-lane-b" style={{ top: '78%' }} />
      <Handle type="source" position={Position.Left} id="s-lane-m" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Top} id="s-top" />
      <span className="agent-name">
        <Icon name={data.icon} size={17} />
        {data.role}
      </span>
      <span className="agent-state">
        <span className={`status-dot ${data.tone === 'active' ? 'solid pulse' : ''}`} />
        {data.status}
      </span>
    </div>
  )
}

const nodeTypes: NodeTypes = { agent: AgentNode }

// Built once. Live phase changes are applied as targeted updates so React Flow
// keeps node internals and handle measurements — recreating the arrays each
// phase made every edge unmount for a frame (the "flaky" shift).
const BASE_NODES: AgentNodeType[] = ROLES.map(({ role, icon }) => {
  const { status, tone } = statusFor(role, initialPhase)
  return {
    id: role,
    type: 'agent' as const,
    position: NODE_POSITION[role],
    draggable: false,
    selectable: false,
    data: { role, icon, status, tone, dimmed: false }
  }
})

const BASE_EDGES: Edge[] = EDGE_DEFS.map((def, index) => ({
  id: `edge-${index}`,
  source: def.source,
  target: def.target,
  sourceHandle: def.sh,
  targetHandle: def.th,
  type: 'smoothstep' as const,
  pathOptions: { offset: 28 },
  animated: false,
  selectable: false,
  className: 'relay-edge',
  label: def.label,
  labelShowBg: true,
  labelBgPadding: [6, 3] as [number, number],
  labelBgBorderRadius: 4,
  labelBgStyle: { fill: 'var(--raised)' },
  labelStyle: { fill: 'var(--muted)', fontSize: 11, fontWeight: 500 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#c9c9c9',
    width: 15,
    height: 15
  }
}))

export default function AgentGraph({
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
  const [nodes, setNodes, onNodesChange] = useNodesState<AgentNodeType>(BASE_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(BASE_EDGES)

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const { status, tone } = statusFor(node.id as AgentRole, phase)
        const dimmed = !!selected && selected !== node.id
        const data = node.data
        if (data.status === status && data.tone === tone && data.dimmed === dimmed) return node
        return { ...node, data: { ...data, status, tone, dimmed } }
      })
    )
  }, [phase, selected, setNodes])

  useEffect(() => {
    setEdges((current) =>
      current.map((edge, index) => {
        const active = phase.kind === 'transit' && phase.index === index
        const done = index < delivered
        const prevDone = (edge.data as { done?: boolean } | undefined)?.done === true
        if (edge.animated === active && prevDone === done) return edge
        return {
          ...edge,
          animated: active,
          className: `relay-edge${active ? ' active' : ''}${done ? ' delivered' : ''}`,
          style: {
            stroke: done || active ? 'var(--ink)' : 'var(--control)',
            strokeWidth: active ? 2 : 1.5
          },
          labelStyle: {
            fill: active ? 'var(--ink)' : 'var(--muted)',
            fontSize: 11,
            fontWeight: active ? 600 : 500
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: done || active ? '#191919' : '#c9c9c9',
            width: 15,
            height: 15
          },
          data: { done }
        }
      })
    )
  }, [phase, delivered, setEdges])

  const activity = liveActivity(phase)

  return (
    <section className="panel agent-panel" aria-labelledby="agents-title">
      <div className="panel-heading">
        <h2 id="agents-title">Agent relay</h2>
        <span className="muted">Live view</span>
      </div>
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
          minZoom={0.4}
          maxZoom={1.25}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => onSelect(selected === node.id ? null : (node.id as AgentRole))}
        />
      </div>
      <div className="graph-footer">
        <span>
          {activity
            ? `${activity.from}: ${activity.text}`
            : selected
              ? `Showing ${selected.toLowerCase()} exchanges`
              : 'Select an agent to inspect its exchanges'}
        </span>
        {selected && (
          <button className="text-button" onClick={() => onSelect(null)}>
            Clear filter <Icon name="close" size={13} />
          </button>
        )}
      </div>
    </section>
  )
}
