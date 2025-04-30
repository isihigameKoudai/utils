import { createFileRoute } from '@tanstack/react-router';
import Index from "../pages";

// 新しいファイルベースのルート定義
export const Route = createFileRoute('/')({
  component: Index,
}); 
