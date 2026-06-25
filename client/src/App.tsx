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



// import { FloatingToolbar } from "@/features/drawing/FloatingToolbar";
// import { PdfViewer } from "@/features/pdf-viewer/PdfViewer";
// import { LayerPanel } from "@/features/layers/LayerPanel";
// import { TreeViewPanel } from "@/features/tree-view/TreeViewPanel";
// import { PageSidebar } from "@/features/page-sidebar/PageSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// function App() {
//   return (
//     <TooltipProvider>
//       <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 font-sans">

//         {/* 左侧：页面信息侧边栏 */}
//         <PageSidebar />

//         {/* 中间：PDF 查看器 + 悬浮工具条 */}
//         <main className="flex-1 flex flex-col overflow-hidden relative">
//           <PdfViewer />
//           {/* 悬浮工具条覆盖在画布区域上 */}
//           <FloatingToolbar />
//         </main>

//         {/* 右侧：图层与元素树（保持不变） */}
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
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { toggleLeftPanel, toggleRightPanel } from "@/app/store/slices/uiSlice";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const dispatch = useAppDispatch();
  const leftPanelOpen = useAppSelector(s => s.ui.leftPanelOpen);
  const rightPanelOpen = useAppSelector(s => s.ui.rightPanelOpen);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 font-sans relative">

        {/* 左侧：页面信息侧边栏 */}
        <aside
          className="flex-shrink-0 h-full z-30 transition-all duration-300 ease-in-out overflow-hidden"
          style={{ width: leftPanelOpen ? 280 : 0 }}
        >
          <PageSidebar />
        </aside>

        {/* 左侧折叠切换按钮 */}
        <button
          onClick={() => dispatch(toggleLeftPanel())}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-5 h-12 bg-white border border-gray-200 rounded-r-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all"
          style={{ left: leftPanelOpen ? 280 : 0 }}
          title={leftPanelOpen ? "收起左侧面板" : "展开左侧面板"}
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <PanelLeftOpen className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        {/* 中间：PDF 查看器 + 悬浮工具条 */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <PdfViewer />
          <FloatingToolbar />
        </main>

        {/* 右侧折叠切换按钮 */}
        <button
          onClick={() => dispatch(toggleRightPanel())}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-5 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-l-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all"
          style={{ right: rightPanelOpen ? 288 : 0 }}
          title={rightPanelOpen ? "收起右侧面板" : "展开右侧面板"}
        >
          {rightPanelOpen ? (
            <PanelRightClose className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <PanelRightOpen className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        {/* 右侧：图层与元素树 */}
        <aside
          className="flex-shrink-0 z-30 flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden bg-white"
          style={{ width: rightPanelOpen ? 288 : 0 }}
        >
          <Tabs defaultValue="layers" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b border-gray-100 bg-white">
              <TabsTrigger value="layers" className="text-xs">图层</TabsTrigger>
              <TabsTrigger value="tree" className="text-xs">元素树</TabsTrigger>
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