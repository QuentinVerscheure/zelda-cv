/**
 * Represents the properties of the information to display in the linkScene
 */
export interface LinkPictureContent {
  picture: {
    x: number;
    y: number;
    pictureName: string;
    pictureUrl: string;
    pictureSize: number;
    pictureLink: string;
  };
}

export interface LinkData {
  link: LinkPictureContent[];
}
