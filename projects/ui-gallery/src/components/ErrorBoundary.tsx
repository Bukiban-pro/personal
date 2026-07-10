import React, { Component, type ReactNode } from 'react'

interface EBProps {
  name: string
  children: ReactNode
  onError?: (message: string) => void
}

interface EBState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message?.slice(0, 160) || 'Render error' }
  }
  componentDidCatch(err: Error) {
    this.props.onError?.(err.message?.slice(0, 220) || 'Render error')
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded border border-dashed border-red-900 bg-red-950/20 p-3 text-center">
          <span className="text-xs font-semibold text-red-400">Runtime error</span>
          <span className="max-w-[260px] break-words text-[10px] leading-tight text-red-400/75">{this.state.message}</span>
        </div>
      )
    }
    return this.props.children
  }
}
