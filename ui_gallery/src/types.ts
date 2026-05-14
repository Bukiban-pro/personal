import React from 'react'

export interface SampleEntry {
  componentName: string
  sourcePath: string
  props: Record<string, unknown>
}

export interface ComponentEntry {
  path: string
  name: string
  shelf: string
  loader: () => Promise<{ [key: string]: React.ComponentType<any> }>
}

export type SlotStatus = 'idle' | 'loading' | 'ok' | 'import-error' | 'runtime-error'
export type HarnessMode = 'safe' | 'strict'
export type FitMode = 'crop' | 'scroll'
export type PreviewSize = 'sm' | 'md' | 'lg'

export type SlotIssue = {
  type: 'import' | 'runtime'
  message: string
}
