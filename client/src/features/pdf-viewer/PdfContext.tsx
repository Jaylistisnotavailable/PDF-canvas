import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useAppDispatch } from '@/app/store/hooks';
import { setLoading, setError, setTotalPages, setFileName } from '@/app/store/slices/pdfSlice';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// 配置 pdfjs worker (使用 CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfContextType {
  document: PDFDocumentProxy | null;
  loadPdf: (source: File | string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);

  const loadPdf = useCallback(async (source: File | string) => {
    setLoadingState(true);
    dispatch(setLoading(true));
    setErrorState(null);

    try {
      let loadingTask: any;
      if (source instanceof File) {
        const arrayBuffer = await source.arrayBuffer();
        loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      } else {
        loadingTask = pdfjsLib.getDocument(source);
      }

      const pdfDoc = await loadingTask.promise;
      const fileName = source instanceof File ? source.name : source.split('/').pop() || 'document.pdf';

      // 1. 更新 Redux 中的元数据
      dispatch(setTotalPages(pdfDoc.numPages));
      dispatch(setFileName(fileName));
      
      // 2. 更新全局 Context 中的复杂实例 (避免被 Redux Immer 序列化破坏)
      setDocument(pdfDoc);
      
      setLoadingState(false);
      dispatch(setLoading(false));
    } catch (err: any) {
      console.error('PDF Load Error:', err);
      const msg = err.message || '加载 PDF 失败';
      setErrorState(msg);
      dispatch(setError(msg));
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <PdfContext.Provider value={{ document, loadPdf, loading, error }}>
      {children}
    </PdfContext.Provider>
  );
}

export function usePdfDocument() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdfDocument must be used within a PdfProvider');
  }
  return context;
}