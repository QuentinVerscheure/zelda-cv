/**
 * Represents the properties of the information to display in the CvScene
 * @param pictureUrl: if picture is clickable, redirection url
 * @param list: a list of items to display ine cvHouse
 */
export interface CvData {
  cv: [
    {
      title1?: string;
      subTitle1?: string;
      picture?: string;
      pictureUrl?: string;
      date?: string;
      text?: string;
      list?: [
        {
          text: string;
        }
      ];
    }
  ];
}
