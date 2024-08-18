import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: () => <div>Hello /register!</div>
})