import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/__probe-route")({
  loader: () => ({ foo: 1 }),
  component: () => <div>probe</div>,
});
