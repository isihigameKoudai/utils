import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/audio/mic')({
  component: () => (
    <div>
      <h1>オーディオ（マイク）</h1>
      <p>マイク入力のデモページです。</p>
    </div>
  ),
}) 
