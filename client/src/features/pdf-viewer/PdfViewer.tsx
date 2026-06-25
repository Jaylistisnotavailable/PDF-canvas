// client/src/features/pdf-viewer/PdfViewer.tsx

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setScale, setCurrentPage } from '@/app/store/slices/pdfSlice';
import { PdfCanvas } from './PdfCanvas';
import { PdfToolbar } from './PdfToolbar';
import { PdfDropZone } from './PdfDropZone';
import { usePdfDocument } from './usePdfDocument';

// 引入绘图与标注叠加层
import { AnnotationCanvas } from '@/features/drawing/AnnotationCanvas';
import { DimensionOverlay } from '@/features/layers/DimensionOverlay';
import { LegendPanel } from '@/features/layers/LegendPanel';

export function PdfViewer() {
  const dispatch = useAppDispatch();
  // const document = useAppSelector((state) => state.pdf.document);
  const { document, loadPdf } = usePdfDocument(); // 使用自定义 Hook 获取 PDF 文档
  const scale = useAppSelector((state) => state.pdf.scale);
  const currentPage = useAppSelector((state) => state.pdf.currentPage);
  const totalPages = useAppSelector((state) => state.pdf.totalPages);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 拖拽平移状态
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const rotation = useAppSelector((state) => state.pdf.pageRotation);

  const handleFileSelect = useCallback((file: File) => loadPdf(file), [loadPdf]);

  // 1. Ctrl + 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      dispatch(setScale(Math.max(0.25, Math.min(4.0, scale + delta))));
    }
  }, [dispatch, scale]);

  // 2. 鼠标拖拽平移
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [isSpacePressed, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // 3. 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); setIsSpacePressed(true); }
      if (e.key === 'ArrowLeft') dispatch(setCurrentPage(Math.max(1, currentPage - 1)));
      else if (e.key === 'ArrowRight') dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)));
      else if (e.key === '+' || e.key === '=') dispatch(setScale(Math.min(4.0, scale + 0.25)));
      else if (e.key === '-') dispatch(setScale(Math.max(0.25, scale - 0.25)));
      else if (e.key === '0') dispatch(setScale(1.0));
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpacePressed(false); };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, currentPage, totalPages, scale]);

  // 动态计算“适宽”
  const handleFitWidth = async () => {
    if (!document || !containerRef.current) return;
    try {
      const page = await document.getPage(currentPage);
      // 获取页面在 1.0 缩放下的原始尺寸
      const viewport = page.getViewport({ scale: 1.0, rotation });
      const containerWidth = containerRef.current.clientWidth;
      
      // 计算适配宽度所需的 scale (减去 20px 作为左右边距 padding)
      const newScale = (containerWidth - 20) / viewport.width;
      dispatch(setScale(newScale));
    } catch (err) {
      console.error("Failed to fit width:", err);
    }
  };

  // 动态计算“适页”
  const handleFitPage = async () => {
    if (!document || !containerRef.current) return;
    try {
      const page = await document.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.0, rotation });
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // 分别计算宽度和高度的比例，取较小值以确保整个页面都在视图内
      const scaleX = (containerWidth - 20) / viewport.width;
      const scaleY = (containerHeight - 20) / viewport.height;
      const newScale = Math.min(scaleX, scaleY);
      
      dispatch(setScale(newScale));
    } catch (err) {
      console.error("Failed to fit page:", err);
    }
  };

  // 未加载 PDF 时显示上传区
  if (!document) {
    return <PdfDropZone onFileSelect={handleFileSelect} />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      {/* 顶部工具栏 */}
      <PdfToolbar 
        onFitWidth={handleFitWidth} 
        onFitPage={handleFitPage} 
      />
      
      {/* 核心视口容器 (Overflow hidden 用于裁剪超出边界的 PDF) */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden select-none"
        style={{ cursor: isPanning ? 'grabbing' : isSpacePressed ? 'grab' : 'default' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 平移容器 (跟随鼠标拖拽移动) */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
          {/* 页面物理容器 (限制 PDF 和 Canvas 的实际宽高) */}
          <div className="relative shadow-2xl bg-white">
            {/* 第 1 层：PDF 渲染层 (z-0) */}
            <PdfCanvas document={document} />
            
            {/* 第 2 层：用户绘图层 (z-10) - 接收所有鼠标事件 */}
            <AnnotationCanvas />
            
            {/* 第 3 层：尺寸标注层 (z-20) - 必须 pointer-events-none 以免阻挡绘图 */}
            <DimensionOverlay />
          </div>
        </div>

        {/* 第 4 层：浮动图例 (z-40) - 放在平移容器外部，保持固定在视口右下角 */}
        <LegendPanel />
        
        {/* 页码信息浮层 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-50 pointer-events-none">
          第 {currentPage} / {totalPages} 页
        </div>
      </div>
    </div>
  );
}