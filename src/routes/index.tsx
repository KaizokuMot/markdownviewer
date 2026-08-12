import { createFileRoute } from "@tanstack/react-router";
import { MarkdownViewer } from "@/components/markdown-viewer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Markdown Viewer — Live Preview" },
      {
        name: "description",
        content:
          "Paste Markdown on the left, see it rendered live on the right. Drag the divider to resize each pane — works on mobile too.",
      },
      { property: "og:title", content: "Markdown Viewer — Live Preview" },
      {
        property: "og:description",
        content:
          "Paste Markdown on the left, see it rendered live on the right. Resizable split panes, mobile responsive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MarkdownViewer />;
}
