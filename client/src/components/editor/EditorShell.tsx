import React, { useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppHeader } from './AppHeader';
import { EditorToolbar } from './EditorToolbar';
import { EditorWorkspace } from './EditorWorkspace';
import { EditorStatusBar } from './EditorStatusBar';

export function EditorShell() {
  const pdfViewerRef = useRef<{ handleFitWidth: () => void; handleFitPage: () => void }>(null);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-editor-background text-foreground font-sans">
        <AppHeader />
        <EditorToolbar />
        <EditorWorkspace viewerRef={pdfViewerRef} />
        <EditorStatusBar 
          onFitWidth={() => pdfViewerRef.current?.handleFitWidth()} 
          onFitPage={() => pdfViewerRef.current?.handleFitPage()} 
        />
      </div>
    </TooltipProvider>
  );
}