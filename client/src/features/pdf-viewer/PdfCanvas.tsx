// client/src/features/pdf-viewer/PdfCanvas.tsx
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useAppSelector } from '@/app/store/hooks'; // 注意你的路径可能是 @/store/hooks
import { usePdfPage } from './usePdfPage';

// 1. 定义 Props 接口
interface PdfCanvasProps {
  document: PDFDocumentProxy | null;
}

// 2. 接收 document 作为 props
export function PdfCanvas({ document }: PdfCanvasProps) {
  // 从 Redux 获取其他状态
  const currentPage = useAppSelector((state) => state.pdf.currentPage);
  const scale = useAppSelector((state) => state.pdf.scale);
  const rotation = useAppSelector((state) => state.pdf.pageRotation);

  // 传入 document
  const { canvasRef, viewport } = usePdfPage(document, currentPage, scale, rotation);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {!viewport ? (
        <div className="w-[600px] h-[800px] bg-gray-200 animate-pulse rounded shadow-lg" />
      ) : (
        <div 
          className="relative shadow-2xl bg-white" 
          style={{ width: viewport.width, height: viewport.height }}
        >
          <canvas ref={canvasRef} className="block" />
          {/* Annotation Layer Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10" />
        </div>
      )}
    </div>
  );
}