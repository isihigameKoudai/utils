import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/audio/speech')({
  component: () => (
    <div>
      <h1>オーディオ（音声認識）</h1>
      <p>音声認識のデモページです。</p>
    </div>
  ),
}) 
