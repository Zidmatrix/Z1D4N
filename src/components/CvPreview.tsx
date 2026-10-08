import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText, Minus, Plus } from "lucide-react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
  TextLayer,
} from "pdfjs-dist";

type PdfRuntime = typeof import("pdfjs-dist");
let runtime: Promise<PdfRuntime> | undefined;

function loadRuntime() {
  // Load the self-hosted renderer and worker only near the CV section.
  return (runtime ??= Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]).then(([pdfjs, worker]) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return pdfjs;
  }));
}

function PdfPage({
  pdf,
  number,
  width,
  onError,
}: {
  pdf: PDFDocumentProxy;
  number: number;
  width: number;
  onError: () => void;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(595 / 842);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let disposed = false;
    let painting: RenderTask | undefined;
    let selection: TextLayer | undefined;
    const textContainer = text.current!;
    setRendered(false);
    textContainer.replaceChildren();

    async function render() {
      const [page, pdfjs] = await Promise.all([
        pdf.getPage(number),
        loadRuntime(),
      ]);
      if (disposed) return;
      const unscaled = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / unscaled.width });
      setRatio(viewport.width / viewport.height);
      const pixels = Math.min(window.devicePixelRatio || 1, 2);
      const surface = canvas.current!;
      surface.width = Math.ceil(viewport.width * pixels);
      surface.height = Math.ceil(viewport.height * pixels);
      sheet.current!.style.setProperty(
        "--total-scale-factor",
        String(viewport.scale * page.userUnit),
      );

      painting = page.render({
        canvas: surface,
        viewport,
        transform: pixels === 1 ? undefined : [pixels, 0, 0, pixels, 0, 0],
      });
      selection = new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: textContainer,
        viewport,
      });
      await Promise.all([painting.promise, selection.render()]);
      if (!disposed) setRendered(true);
    }

    void render().catch((error: unknown) => {
      if (
        !disposed &&
        !(
          error instanceof Error && error.name === "RenderingCancelledException"
        )
      ) {
        onError();
      }
    });
    return () => {
      disposed = true;
      painting?.cancel();
      selection?.cancel();
      textContainer.replaceChildren();
    };
  }, [pdf, number, width, onError]);

  return (
    <div
      ref={sheet}
      className="cv-page"
      style={{ width, aspectRatio: ratio }}
      data-rendered={rendered}
      role="group"
      aria-label={`CV page ${number}`}
      aria-busy={!rendered}
    >
      <canvas ref={canvas} aria-hidden="true" />
      <div ref={text} className="cv-text-layer" />
      {!rendered && (
        <span className="cv-page-loading" role="status">
          Loading page {number}…
        </span>
      )}
    </div>
  );
}

export default function CvPreview({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const frame = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [failed, setFailed] = useState(false);
  const [fitWidth, setFitWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const onError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(frame.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setFitWidth(Math.max(1, Math.floor(entry.contentRect.width)));
    });
    observer.observe(viewport.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearby) return;
    let disposed = false;
    let loading: PDFDocumentLoadingTask | undefined;
    setFailed(false);
    setPdf(null);
    void loadRuntime()
      .then(async (pdfjs) => {
        if (disposed) return;
        loading = pdfjs.getDocument({ url: src });
        const document = await loading.promise;
        if (!disposed) setPdf(document);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      void loading?.destroy().catch(() => {});
    };
  }, [nearby, src]);

  function fitToWidth() {
    setZoom(1);
    viewport.current?.scrollTo({ left: 0, top: 0, behavior: "instant" });
  }

  const canZoom = !!pdf && fitWidth > 0 && !failed;
  return (
    <section
      id="cv"
      className="cv-preview"
      ref={frame}
      aria-labelledby="cv-title"
    >
      <header className="cv-heading">
        <div className="cv-heading-label">
          <span className="cv-document-icon" aria-hidden="true">
            <FileText size={23} />
          </span>
          <div>
            <span className="micro">CURRICULUM VITAE</span>
            <h3 id="cv-title">{name}</h3>
          </div>
        </div>
        <div className="cv-actions">
          <a href={src} target="_blank" rel="noreferrer" className="text-link">
            Open PDF <ArrowUpRight size={15} />
          </a>
          <a href={src} download className="text-link cv-download">
            Download CV <ArrowDown size={15} />
          </a>
        </div>
      </header>
      <div className="cv-frame">
        <div className="cv-toolbar">
          <div className="cv-zoom" role="group" aria-label="CV zoom controls">
            <button
              type="button"
              className="icon-button"
              aria-label="Zoom out CV"
              disabled={!canZoom || zoom <= 1}
              onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
            >
              <Minus size={16} />
            </button>
            <button type="button" onClick={fitToWidth} disabled={!canZoom}>
              Fit to width
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Zoom in CV"
              disabled={!canZoom || zoom >= 3}
              onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="cv-page-count" role="status">
            {pdf
              ? `${Math.round(zoom * 100)}% · ${pdf.numPages} ${pdf.numPages === 1 ? "page" : "pages"}`
              : "PDF"}
          </span>
        </div>
        <div
          className="cv-viewport"
          ref={viewport}
          role="region"
          aria-label="CV document pages"
          tabIndex={0}
        >
          {failed ? (
            <p className="cv-loading" role="alert">
              The preview could not be loaded. Use Open PDF to read the CV.
            </p>
          ) : pdf && fitWidth > 0 ? (
            Array.from({ length: pdf.numPages }, (_, index) => (
              <PdfPage
                key={index}
                pdf={pdf}
                number={index + 1}
                width={fitWidth * zoom}
                onError={onError}
              />
            ))
          ) : (
            <p className="cv-loading" role="status">
              Loading CV…
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
