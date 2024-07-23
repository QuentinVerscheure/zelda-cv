/**
 * Represents the properties of the information to display in the CvScene
 */
export interface CvContent {
  cv: [
    {
      title1: string;
      subTitle1: string;
      logo: string;
      date: string;
      text: string;
      list: [
        {
          text: string;
        }
      ];
    }
  ];
}
