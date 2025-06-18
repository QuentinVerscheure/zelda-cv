/**
 * Represents the properties of the information to display in the CvScene
 * @param pictureUrl: if picture is clickable, redirection url
 * @param list: a list of items to display in cvHouse
 */
export interface CvData {
  cv: Array<{
    title1?: string;
    subTitle1?: string;
    picture?: string;
    pictureUrl?: string;
    date?: string;
    text?: string;
    list?: Array<{
      text: string;
    }>;
  }>;
}
