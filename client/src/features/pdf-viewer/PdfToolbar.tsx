// // client/src/features/pdf-viewer/PdfToolbar.tsx

// import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
// import { 
//   setCurrentPage, setScale, zoomIn, zoomOut, rotate 
// } from '@/app/store/slices/pdfSlice';
// import { toggleToolbar } from '@/app/store/slices/uiSlice';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { 
//   ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
//   ZoomIn, ZoomOut, RotateCw, Maximize2, Maximize, 
//   ChevronUp
// } from 'lucide-react';

// interface PdfToolbarProps {
//   onFitWidth: () => void;
//   onFitPage: () => void;
// }

// export function PdfToolbar({ onFitWidth, onFitPage }: PdfToolbarProps) {
//   const dispatch = useAppDispatch();
//   const currentPage = useAppSelector((state) => state.pdf.currentPage);
//   const totalPages = useAppSelector((state) => state.pdf.totalPages);
//   const scale = useAppSelector((state) => state.pdf.scale);

//   const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = parseInt(e.target.value, 10);
//     if (!isNaN(val) && val >= 1 && val <= totalPages) {
//       dispatch(setCurrentPage(val));
//     }
//   };

//   const handlePresetZoom = (val: string) => {
//     dispatch(setScale(parseFloat(val)));
//   };

//   return (
//     <div className="flex items-center gap-2 p-2 bg-white border-b shadow-sm z-20 overflow-x-auto">
//       {/* 翻页控制 */}
//       <div className="flex items-center gap-1">
//         <Button variant="ghost" size="icon" onClick={() => dispatch(setCurrentPage(1))} disabled={currentPage <= 1}>
//           <ChevronsLeft className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon" onClick={() => dispatch(setCurrentPage(currentPage - 1))} disabled={currentPage <= 1}>
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
        
//         <div className="flex items-center gap-1 px-2">
//           <Input 
//             type="number" 
//             min={1} 
//             max={totalPages} 
//             value={currentPage} 
//             onChange={handlePageChange}
//             className="w-12 h-8 text-center"
//           />
//           <span className="text-sm text-gray-500 whitespace-nowrap">/ {totalPages}</span>
//         </div>

//         <Button variant="ghost" size="icon" onClick={() => dispatch(setCurrentPage(currentPage + 1))} disabled={currentPage >= totalPages}>
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon" onClick={() => dispatch(setCurrentPage(totalPages))} disabled={currentPage >= totalPages}>
//           <ChevronsRight className="h-4 w-4" />
//         </Button>
//       </div>

//       <Separator orientation="vertical" className="h-6" />

//       {/* 缩放控制 */}
//       <div className="flex items-center gap-1">
//         <Button variant="ghost" size="icon" onClick={() => dispatch(zoomOut())}>
//           <ZoomOut className="h-4 w-4" />
//         </Button>
        
//         <Select value={scale.toFixed(2)} onValueChange={handlePresetZoom}>
//           <SelectTrigger className="w-[80px] h-8">
//             <SelectValue placeholder="Zoom" />
//           </SelectTrigger>
//           <SelectContent>
//             {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0].map((z) => (
//               <SelectItem key={z} value={z.toFixed(2)}>
//                 {Math.round(z * 100)}%
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Button variant="ghost" size="icon" onClick={() => dispatch(zoomIn())}>
//           <ZoomIn className="h-4 w-4" />
//         </Button>
//       </div>

//       <Separator orientation="vertical" className="h-6" />

//       {/* 适应与旋转 */}
//       <div className="flex items-center gap-1">
//         <Button variant="ghost" size="sm" onClick={onFitWidth}>
//           <Maximize2 className="h-4 w-4 mr-1" /> 适宽
//         </Button>
//         <Button variant="ghost" size="sm" onClick={onFitPage}>
//           <Maximize className="h-4 w-4 mr-1" /> 适页
//         </Button>
//         <Button variant="ghost" size="icon" onClick={() => dispatch(rotate())}>
//           <RotateCw className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* 折叠按钮 */}
//       <div className="ml-auto">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => dispatch(toggleToolbar())}
//           title="收起工具栏"
//         >
//           <ChevronUp className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }


import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import {
  setCurrentPage, setScale, zoomIn, zoomOut, rotate
} from '@/app/store/slices/pdfSlice';
import { toggleToolbar } from '@/app/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ZoomIn, ZoomOut, RotateCw, Maximize2, Maximize,
  ChevronUp
} from 'lucide-react';

interface PdfToolbarProps {
  onFitWidth: () => void;
  onFitPage: () => void;
}

export function PdfToolbar({ onFitWidth, onFitPage }: PdfToolbarProps) {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pdf.currentPage);
  const totalPages = useAppSelector((state) => state.pdf.totalPages);
  const scale = useAppSelector((state) => state.pdf.scale);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      dispatch(setCurrentPage(val));
    }
  };

  const handlePresetZoom = (val: string) => {
    dispatch(setScale(parseFloat(val)));
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-20 overflow-x-auto">
      {/* 翻页控制 */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(setCurrentPage(1))} disabled={currentPage <= 1}>
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(setCurrentPage(currentPage - 1))} disabled={currentPage <= 1}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-1 px-1.5">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            className="w-10 h-7 text-center text-xs"
          />
          <span className="text-xs text-gray-500 whitespace-nowrap">/ {totalPages}</span>
        </div>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(setCurrentPage(currentPage + 1))} disabled={currentPage >= totalPages}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(setCurrentPage(totalPages))} disabled={currentPage >= totalPages}>
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* 缩放控制 */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(zoomOut())}>
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Select value={scale.toFixed(2)} onValueChange={handlePresetZoom}>
          <SelectTrigger className="w-[70px] h-7 text-xs">
            <SelectValue placeholder="Zoom" />
          </SelectTrigger>
          <SelectContent>
            {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0].map((z) => (
              <SelectItem key={z} value={z.toFixed(2)}>
                {Math.round(z * 100)}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(zoomIn())}>
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* 适应与旋转 */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onFitWidth}>
          <Maximize2 className="h-3.5 w-3.5 mr-1" /> 适宽
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onFitPage}>
          <Maximize className="h-3.5 w-3.5 mr-1" /> 适页
        </Button>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => dispatch(rotate())}>
          <RotateCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 折叠按钮 */}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          onClick={() => dispatch(toggleToolbar())}
          title="收起工具栏"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}