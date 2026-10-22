import type { CSSProperties } from 'react'

const paths = {
  plus: 'M12 5v14M5 12h14',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  back: 'M20 12H4m6-6-6 6 6 6',
  chevron: 'm9 5 7 7-7 7',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  history: 'M3 11a9 9 0 1 1 2.6 7M3 4v7h7m2-4v5l3 2',
  settings: 'M4 7h16M4 17h16M8 4v6m8 4v6',
  workflow: 'M12 8v4M5 16v-4h14v4M9 3h6v5H9zM2 16h6v5H2zM16 16h6v5h-6z',
  file: 'M14 3H5v18h14V8l-5-5v5h5M8 12h8m-8 4h6',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  info: 'M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  play: 'm8 4 12 8-12 8z',
  link: 'm10 13 4-4M8 15l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 6 0m0 2 2-2a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-6 0',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12m13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  stop: 'M6 6h12v12H6z',
  pause: 'M9 5v14M15 5v14'
} as const

export default function Icon({
  name,
  size = 18,
  style
}: {
  name: keyof typeof paths
  size?: number
  style?: CSSProperties
}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  )
}

export function RelayMark(): React.JSX.Element {
  return (
    <svg
      className="relay-mark"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19 14 5l9 14H5Zm0 0 9 5 9-5M14 5v19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="5" r="2.5" fill="currentColor" />
      <circle cx="5" cy="19" r="2.5" fill="currentColor" />
      <circle cx="23" cy="19" r="2.5" fill="currentColor" />
    </svg>
  )
}
