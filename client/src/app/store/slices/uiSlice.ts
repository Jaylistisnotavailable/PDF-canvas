import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface UiState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  treeViewExpanded: boolean;
  aiPanelOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

const initialState: UiState = {
  leftPanelOpen: true,
  rightPanelOpen: true,
  treeViewExpanded: true,
  aiPanelOpen: false,
  theme: 'system',
  showGrid: true,
  snapToGrid: false,
  gridSize: 20,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLeftPanel: (state) => { state.leftPanelOpen = !state.leftPanelOpen; },
    toggleRightPanel: (state) => { state.rightPanelOpen = !state.rightPanelOpen; },
    toggleTreeView: (state) => { state.treeViewExpanded = !state.treeViewExpanded; },
    toggleAiPanel: (state) => { state.aiPanelOpen = !state.aiPanelOpen; },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleGrid: (state) => { state.showGrid = !state.showGrid; },
    toggleSnapToGrid: (state) => { state.snapToGrid = !state.snapToGrid; },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = action.payload;
    },
  },
});

export const {
  toggleLeftPanel, toggleRightPanel, toggleTreeView, toggleAiPanel,
  setTheme, toggleGrid, toggleSnapToGrid, setGridSize
} = uiSlice.actions;

// Selectors
export const selectLeftPanelOpen = (state: RootState) => state.ui.leftPanelOpen;
export const selectRightPanelOpen = (state: RootState) => state.ui.rightPanelOpen;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectGridSettings = (state: RootState) => ({
  show: state.ui.showGrid,
  snap: state.ui.snapToGrid,
  size: state.ui.gridSize,
});

export default uiSlice;