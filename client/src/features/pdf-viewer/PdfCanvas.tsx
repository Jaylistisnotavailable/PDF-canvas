// client/src/features/pdf-viewer/PdfCanvas.tsx
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useAppSelector } from '@/app/store/hooks'; 
import { usePdfPage } from './usePdfPage';

interface PdfCanvasProps {
  document: PDFDocumentProxy | null;
}

export function PdfCanvas({ document }: PdfCanvasProps) {
  const currentPage = useAppSelector((state) => state.pdf.currentPage);
  const scale = useAppSelector((state) => state.pdf.scale);
  const rotation = useAppSelector((state) => state.pdf.pageRotation);

  const { canvasRef, viewport } = usePdfPage(document, currentPage, scale, rotation);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div 
        className="relative shadow-2xl bg-white" 
        style={{ 
          // 如果还没计算出 viewport，先给一个默认的骨架尺寸
          width: viewport ? viewport.width : 600, 
          height: viewport ? viewport.height : 800 
        }}
      >
        {/* 1. Loading 骨架屏 (仅在 viewport 为 null 时显示) */}
        {!viewport && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}

        {/* 2. 【关键修复】：始终渲染 canvas 元素，确保 canvasRef.current 在 useEffect 运行时永远不为 null */}
        <canvas 
          ref={canvasRef} 
          className="block" 
          style={{ display: viewport ? 'block' : 'none' }}
        />

        {/* 3. Annotation Layer Overlay */}
        {viewport && (
          <div className="absolute inset-0 pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
}