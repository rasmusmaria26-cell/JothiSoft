'use client';
import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; label?: string; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="rounded-xl border border-yellow-800/30 bg-neutral-900 p-8 text-center space-y-3">
        <p className="text-yellow-500 text-lg">✦ பிழை ஏற்பட்டது · Something went wrong</p>
        <p className="text-sm text-neutral-400">{this.props.label ?? 'This section failed to load.'}</p>
        <button
          onClick={() => this.setState({ hasError: false })}
          className="rounded-lg border border-yellow-700 px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-900/30 transition cursor-pointer"
        >
          மீண்டும் முயல்க · Try Again
        </button>
      </div>
    );
  }
}
