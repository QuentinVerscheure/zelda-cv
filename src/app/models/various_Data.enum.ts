/**
 * Represents the properties of the information to display in the various house
 */

export interface BoxData {
  type: 'text' | 'image';
  text?: string;
  key?: string;
  pictureUrl?: string;
  xOffset: number;
  yOffset: number;
  height?: number;
}

export interface Box {
  title: string;
  x: number;
  y: number;
  elements: BoxData[];
}

export interface VariousContentConfig {
  boxes: Box[];
}
