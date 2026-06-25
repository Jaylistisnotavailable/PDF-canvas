import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export function usePdfPage(
  document: PDFDocumentProxy | null,
  pageNumber: number,
  scale: number,
  rotation: number = 0
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!document || !canvasRef.current || pageNumber < 1) return;

    let isMounted = true;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const renderPage = async () => {
      try {
        const page = await document.getPage(pageNumber);
        if (!isMounted) return;

        const vp = page.getViewport({ scale, rotation });
        setViewport({ width: vp.width, height: vp.height });

        // 处理 HiDPI (Retina 屏幕)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = vp.width * dpr;
        canvas.height = vp.height * dpr;
        canvas.style.width = `${vp.width}px`;
        canvas.style.height = `${vp.height}px`;
        
        context.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
        context.scale(dpr, dpr);

        const renderContext = { canvasContext: context, viewport: vp };
        
        // 取消之前的渲染任务
        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch (e) {}
        }

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    // 防抖 100ms，避免快速缩放时频繁渲染
    const timer = setTimeout(renderPage, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (e) {}
      }
    };
  }, [document, pageNumber, scale, rotation]);

  return { canvasRef, viewport };
}