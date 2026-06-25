// import { FileText, Pen, Layers, TreePine, Bot } from 'lucide-react'

// function App() {
//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900">
//       {/* 左侧工具栏 */}
//       <aside className="flex w-16 flex-col items-center gap-4 border-r bg-white py-4 shadow-sm">
//         <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="PDF Viewer">
//           <FileText className="h-6 w-6 text-gray-600" />
//         </button>
//         <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="Drawing">
//           <Pen className="h-6 w-6 text-gray-600" />
//         </button>
//         <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="Layers">
//           <Layers className="h-6 w-6 text-gray-600" />
//         </button>
//         <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="Tree View">
//           <TreePine className="h-6 w-6 text-gray-600" />
//         </button>
//         <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="AI Assistant">
//           <Bot className="h-6 w-6 text-gray-600" />
//         </button>
//       </aside>

//       {/* 中间画布 */}
//       <main className="flex flex-1 flex-col items-center justify-center overflow-auto bg-gray-50 p-8">
//         <div className="h-full w-full max-w-4xl rounded-lg border-2 border-dashed border-gray-300 bg-white shadow-inner flex items-center justify-center">
//           <p className="text-gray-400 text-lg">PDF Canvas Area (pdfjs-dist will render here)</p>
//         </div>
//       </main>

//       {/* 右侧面板 */}
//       <aside className="w-80 border-l bg-white p-4 shadow-sm overflow-y-auto">
//         <h2 className="mb-4 text-lg font-semibold border-b pb-2">Properties / Layers</h2>
//         <p className="text-sm text-gray-500">Right panel content goes here.</p>
//       </aside>
//     </div>
//   )
// }

// export default App

import { DrawingToolbar } from '@/features/drawing/DrawingToolbar';
import { PdfViewer } from '@/features/pdf-viewer/PdfViewer';
import { LayerPanel } from '@/features/layers/LayerPanel';
import { TreeViewPanel } from '@/features/tree-view/TreeViewPanel';
import { TooltipProvider } from '@/components/ui/tooltip';

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

function App() {
  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 font-sans">
        {/* 左侧：绘图工具栏 (固定宽度) */}
        <aside className="flex-shrink-0 z-30">
          <DrawingToolbar />
        </aside>

        {/* 中间：PDF 查看器与画布 (自适应宽度) */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <PdfViewer />
        </main>

        {/* 右侧：图层与属性面板 (固定宽度) */}
        <aside className="flex-shrink-0 w-72 z-30 border-l shadow-sm flex flex-col">
          <Tabs defaultValue="layers" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="layers">图层</TabsTrigger>
              <TabsTrigger value="tree">元素树</TabsTrigger>
            </TabsList>
            <TabsContent value="layers" className="flex-1 overflow-hidden mt-0">
              <LayerPanel />
            </TabsContent>
            <TabsContent value="tree" className="flex-1 overflow-hidden mt-0">
              <TreeViewPanel />
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </TooltipProvider>
  );
}

export default App;