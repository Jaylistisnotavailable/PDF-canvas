// client/src/App.tsx

// import { DrawingToolbar } from '@/features/drawing/DrawingToolbar';
// import { PdfViewer } from '@/features/pdf-viewer/PdfViewer';
// import { LayerPanel } from '@/features/layers/LayerPanel';
// import { TreeViewPanel } from '@/features/tree-view/TreeViewPanel';
// import { TooltipProvider } from '@/components/ui/tooltip';

// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from "@/components/ui/tabs";

// function App() {
//   return (
//     <TooltipProvider>
//       <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 font-sans">
//         {/* 左侧：绘图工具栏 (固定宽度) */}
//         <aside className="flex-shrink-0 z-30">
//           <DrawingToolbar />
//         </aside>

//         {/* 中间：PDF 查看器与画布 (自适应宽度) */}
//         <main className="flex-1 flex flex-col overflow-hidden relative">
//           <PdfViewer />
//         </main>

//         {/* 右侧：图层与属性面板 (固定宽度) */}
//         <aside className="flex-shrink-0 w-72 z-30 border-l shadow-sm flex flex-col">
//           <Tabs defaultValue="layers" className="flex flex-col h-full">
//             <TabsList className="w-full justify-start rounded-none border-b">
//               <TabsTrigger value="layers">图层</TabsTrigger>
//               <TabsTrigger value="tree">元素树</TabsTrigger>
//             </TabsList>
//             <TabsContent value="layers" className="flex-1 overflow-hidden mt-0">
//               <LayerPanel />
//             </TabsContent>
//             <TabsContent value="tree" className="flex-1 overflow-hidden mt-0">
//               <TreeViewPanel />
//             </TabsContent>
//           </Tabs>
//         </aside>
//       </div>
//     </TooltipProvider>
//   );
// }

// export default App;



import { FloatingToolbar } from "@/features/drawing/FloatingToolbar";
import { PdfViewer } from "@/features/pdf-viewer/PdfViewer";
import { LayerPanel } from "@/features/layers/LayerPanel";
import { TreeViewPanel } from "@/features/tree-view/TreeViewPanel";
import { PageSidebar } from "@/features/page-sidebar/PageSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 font-sans">

        {/* 左侧：页面信息侧边栏 */}
        <PageSidebar />

        {/* 中间：PDF 查看器 + 悬浮工具条 */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <PdfViewer />
          {/* 悬浮工具条覆盖在画布区域上 */}
          <FloatingToolbar />
        </main>

        {/* 右侧：图层与元素树（保持不变） */}
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