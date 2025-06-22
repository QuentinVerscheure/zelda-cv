/**
 * a user commentary in the guestBook scene
 * @param user: the user name of the author of the message
 * @param message: the message
 * @param date: the date of the message
 * @param x: coordinates x of the message in the scene
 * @param y: coordinates y of the message in the scene  
 * @param newComment: if true, the message is a new comment and should be displayed in the scene from DB
 */
export interface GuestBookDto {
  id?: number;
  userPseudo: string;
  comment: string;
  date: Date;
  coordinateX: number;
  coordinateY: number;
}
