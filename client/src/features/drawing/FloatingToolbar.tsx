// client/src/features/drawing/FloatingToolbar.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import {
  setActiveTool, setStrokeColor, setStrokeWidth, deleteSelected,
  ToolType,
} from "@/app/store/slices/drawingSlice";
import { cn } from "@/lib/utils";
import {
  MousePointer2, CircleDot, Minus, Share2, Pentagon, Square, Circle,
  Type, Ruler, Eraser, Trash2, ChevronDown, ChevronUp, Palette,
} from "lucide-react";

interface ToolDef {
  id: ToolType;
  label: string;
  icon: React.ReactNode;
  hint: string;
}

const TOOLS: ToolDef[] = [
  { id: "select",    label: "选择",  icon: <MousePointer2 className="w-4 h-4" />, hint: "点击选择标注，拖动移动" },
  { id: "point",     label: "点",    icon: <CircleDot className="w-4 h-4" />,     hint: "单击放置标记点" },
  { id: "line",      label: "直线",  icon: <Minus className="w-4 h-4" />,         hint: "点击起点，拖动画直线" },
  { id: "polyline",  label: "折线",  icon: <Share2 className="w-4 h-4" />,        hint: "单击添加节点，双击结束" },
  { id: "polygon",   label: "多边形",icon: <Pentagon className="w-4 h-4" />,      hint: "单击添加顶点，双击闭合" },
  { id: "rectangle", label: "矩形",  icon: <Square className="w-4 h-4" />,        hint: "拖动画矩形区域" },
  { id: "circle",    label: "圆形",  icon: <Circle className="w-4 h-4" />,        hint: "从圆心拖动画圆" },
  { id: "text",      label: "文字",  icon: <Type className="w-4 h-4" />,          hint: "单击放置文字标注" },
  { id: "measure",   label: "测量",  icon: <Ruler className="w-4 h-4" />,         hint: "拖动测量距离" },
  { id: "eraser",    label: "橡皮擦",icon: <Eraser className="w-4 h-4" />,        hint: "点击删除标注" },
];

const PRESET_COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#06B6D4", "#F97316", "#EC4899",
  "#1F2937", "#6B7280",
];

export function FloatingToolbar() {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(s => s.drawing.activeTool);
  const strokeColor = useAppSelector(s => s.drawing.currentStrokeColor);
  const strokeWidth = useAppSelector(s => s.drawing.currentStrokeWidth);
  const selectedIds = useAppSelector(s => s.drawing.selectedShapeIds);
  const totalPages = useAppSelector(s => s.pdf.totalPages);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [expanded, setExpanded] = useState(true);

  if (totalPages === 0) return null;  // 没加载 PDF 时不显示

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      style={{ pointerEvents: "none" }}
    >
      {/* 工具提示文字 */}
      {expanded && (
        <div className="px-3 py-1 rounded-full text-xs text-gray-500 bg-white/70 backdrop-blur-sm border border-gray-200/50">
          {TOOLS.find(t => t.id === activeTool)?.hint}
          {activeTool !== "select" && (
            <span className="ml-2 text-gray-400">· ESC 取消</span>
          )}
        </div>
      )}

      {/* 主工具条 */}
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-gray-200/60"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          pointerEvents: "auto",
        }}
      >
        {expanded && (
          <>
            {/* 工具按钮 */}
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                onClick={() => dispatch(setActiveTool(tool.id))}
                title={`${tool.label} — ${tool.hint}`}
                className={cn(
                  "relative w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95",
                  activeTool === tool.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                {activeTool === tool.id && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-blue-600" />
                )}
                {tool.icon}
              </button>
            ))}

            {/* 分隔线 */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* 颜色选择 */}
            <button
              onClick={() => setShowColorPicker(v => !v)}
              className={cn(
                "relative w-8 h-8 rounded-lg flex items-center justify-center border",
                showColorPicker ? "border-blue-500 bg-blue-50" : "border-transparent hover:bg-gray-100"
              )}
              title="颜色"
            >
              <div
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ background: strokeColor }}
              />
            </button>

            {/* 线宽 */}
            <div className="flex items-center gap-1 ml-1">
              {[1, 2, 3, 5].map(w => (
                <button
                  key={w}
                  onClick={() => dispatch(setStrokeWidth(w))}
                  className={cn(
                    "w-7 h-7 rounded flex items-center justify-center text-xs font-mono transition-all",
                    strokeWidth === w
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                  title={`线宽 ${w}px`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* 删除选中 */}
            <button
              onClick={() => dispatch(deleteSelected())}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                "text-red-500 hover:bg-red-50",
                selectedIds.length === 0 && "opacity-40 cursor-not-allowed"
              )}
              title="删除选中 (Delete)"
              disabled={selectedIds.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}

        {/* 折叠按钮 */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 ml-1"
          title={expanded ? "收起工具栏" : "展开工具栏"}
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* 折叠状态显示当前工具 */}
        {!expanded && (
          <div className="flex items-center gap-1 px-1">
            <div className="w-6 h-6 rounded flex items-center justify-center text-blue-600">
              {TOOLS.find(t => t.id === activeTool)?.icon}
            </div>
            <span className="text-xs font-medium">
              {TOOLS.find(t => t.id === activeTool)?.label}
            </span>
          </div>
        )}
      </div>

      {/* 颜色选择面板 */}
      {showColorPicker && expanded && (
        <div
          className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-gray-200/60 w-48"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            pointerEvents: "auto",
          }}
        >
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              onClick={() => {
                dispatch(setStrokeColor(color));
                setShowColorPicker(false);
              }}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                strokeColor === color ? "border-gray-800 scale-110" : "border-transparent"
              )}
              style={{ background: color }}
            />
          ))}
          <label className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500"
            title="自定义颜色">
            <input
              type="color"
              value={strokeColor}
              onChange={e => dispatch(setStrokeColor(e.target.value))}
              className="opacity-0 absolute w-0 h-0"
            />
            <Palette className="w-3 h-3 text-gray-400" />
          </label>
        </div>
      )}
    </div>
  );
}