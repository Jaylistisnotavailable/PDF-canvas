// 基础几何形状类型
export type ShapeType = 'rect' | 'circle' | 'line' | 'text';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Shape {
  id: string;
  type: ShapeType;
  position: Position;
  size?: Size;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation?: number;
  opacity?: number;
  // 文字特有
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  shapes: Shape[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  layers: Layer[];
  currentLayerId?: string;
  createdAt: string;
  updatedAt: string;
}