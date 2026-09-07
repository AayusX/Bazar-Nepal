import { useWindowDimensions } from 'react-native';

export const SCREEN_PADDING = 16;
export const GRID_GAP = 12;

export const useGridCardWidth = () => {
  const { width } = useWindowDimensions();
  return (width - SCREEN_PADDING * 2 - GRID_GAP) / 2;
};
