import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Eraser, Eye, FileText, Columns2, Rows2 } from "lucide-react";

const SAMPLE = `# Markdown Viewer

Paste your **Markdown** on the left and see it rendered live on the right.

## Features

- Live preview as you type
- Drag the divider to resize either pane
- Supports GitHub-Flavored Markdown

## Syntax

Inline code: \`const x = 42\`

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Blockquotes look like this — great for callouts.

| Feature        | Status |
| -------------- | :----: |
| Tables         |     
| Task lists     |     

- [x] Render markdown
- [ ] Add more demos

[Visit Lovable](https://lovable.dev)

---

Made with ☕ and react-markdown.
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function PaneLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function MarkdownViewer() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const isMobile = useIsMobile();
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [layoutKey, setLayoutKey] = useState(0);

  // Force Group to re-mount when switching axis (mobile <-> desktop)
  useEffect(() => {
    setOrientation(isMobile ? "vertical" : "horizontal");
    setLayoutKey((k) => k + 1);
  }, [isMobile]);

  const onClear = () => setMarkdown("");

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-foreground">
              Markdown Viewer
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Paste & preview, drag to resize
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            {isMobile ? (
              <>
                <Rows2 className="h-3.5 w-3.5" /> Stacked
              </>
            ) : (
              <>
                <Columns2 className="h-3.5 w-3.5" /> Side by side
              </>
            )}
          </span>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </header>

      {/* Split panes */}
      <div className="min-h-0 flex-1">
        <Group
          key={layoutKey}
          orientation={orientation}
          className="flex h-full"
          style={
            orientation === "horizontal"
              ? { flexDirection: "row" }
              : { flexDirection: "column" }
          }
        >
          <Panel
            id="editor"
            defaultSize={50}
            minSize={20}
            className="flex min-h-0 min-w-0 flex-1 basis-0 overflow-hidden"
          >
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <PaneLabel icon={FileText}>Editor</PaneLabel>
                <span className="text-[0.7rem] text-muted-foreground">
                  {markdown.length} chars
                </span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
                placeholder="Type or paste Markdown here…"
                className="min-h-0 flex-1 resize-none bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </Panel>

          <Separator
            className={
              orientation === "vertical"
                ? "group relative h-1.5 w-full shrink-0 cursor-row-resize bg-border transition-colors hover:bg-primary/50"
                : "group relative h-full w-1.5 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary/50"
            }
          >
            <span
              className={
                orientation === "vertical"
                  ? "absolute left-1/2 top-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 transition-colors group-hover:bg-primary"
                  : "absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 transition-colors group-hover:bg-primary"
              }
            />
          </Separator>

          <Panel
            id="preview"
            defaultSize={50}
            minSize={20}
            className="flex min-h-0 min-w-0 flex-1 basis-0 overflow-hidden"
          >
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center border-b px-4 py-2">
                <PaneLabel icon={Eye}>Preview</PaneLabel>
              </div>
              <div className="markdown-body min-h-0 flex-1 overflow-auto px-5 py-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
                {markdown.trim() === "" && (
                  <p className="text-muted-foreground/60">
                    Nothing to preview yet — start typing on the left.
                  </p>
                )}
              </div>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  );
}
