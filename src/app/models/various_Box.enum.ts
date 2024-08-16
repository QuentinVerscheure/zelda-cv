/**
 * Represents the properties of the information to display in the various house
 */

export interface BoxElement {
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
  elements: BoxElement[];
}

export interface VariousContentConfig {
  boxes: Box[];
}
