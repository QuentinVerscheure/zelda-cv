/**
 * Represents the properties of the information to display in the portfolio1 and portfolio2 scenes
 */

export interface MoreElements {
  type: 'text' | 'image';
  picture?: Picture;
  xOffset: number;
  yOffset: number;
  height?: number;
  text?: string[]; 
}

export interface PortfolioEntry {
  title1?: string;
  subTitle1?: string;
  date?: string; 
  picture?: Picture;
  main?: { text: string | Picture}[];
  more?: MoreElements[]; 
}

export interface PortfolioDatas {
  portfolio: PortfolioEntry[];
}

export interface Picture{
    pictureName: string;
    pictureUrl: string;
    pictureSize: number;
    pictureLink?: string;
    downloadLink?: string
}

export interface portfolio2Data{
  portfolio1Information: { x: number; y: number; firstAnimationFrame: string };
  portfolio2Number: number
}
