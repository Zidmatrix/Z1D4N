import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Download, X } from "lucide-react";
import type { Article } from "../content";

export default function ArticleDialog({
  article,
  onClose,
}: {
  article: Article | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (article && !dialog.open) {
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
    }
    if (!article && dialog.open) {
      dialog.close();
      returnFocus.current?.focus({ preventScroll: true });
    }
    if (!article) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [article]);

  return (
    <dialog
      ref={ref}
      className="article-dialog"
      aria-labelledby="article-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      {article && (
        <div className="dialog-panel">
          <header className="dialog-header">
            <div>
              <span className="micro">
                {article.kind === "report"
                  ? "PROJECT REPORT"
                  : "LEARNING JOURNAL"}
              </span>
              <h2 id="article-title">{article.title}</h2>
            </div>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Close article"
            >
              <X size={22} />
            </button>
          </header>
          <article className="markdown">
            <Markdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target={href?.startsWith("https://") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {children}
                  </a>
                ),
                h1: ({ children }) => <h3>{children}</h3>,
              }}
            >
              {article.body}
            </Markdown>
          </article>
          <footer className="dialog-footer">
            <span>Inspectable work. Clear limitations.</span>
            <a
              href={article.download}
              download={`${article.id}.md`}
              className="text-link"
            >
              <Download size={16} />
              Download Markdown
            </a>
          </footer>
        </div>
      )}
    </dialog>
  );
}
