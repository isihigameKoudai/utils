import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/noise/')({
  component: () => (
    <div>ノイズページ</div>
  ),
}) 
