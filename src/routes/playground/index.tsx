import { createFileRoute } from '@tanstack/react-router';
import PlaygroundPage from "../../pages/Playground";

export const Route = createFileRoute('/playground')({
  component: PlaygroundPage,
}); 
