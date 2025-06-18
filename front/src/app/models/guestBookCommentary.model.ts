/**
 * a user commentary in the guestBook scene
 * @param user: the user name of the author of the message
 * @param message: the message
 * @param date: the date of the message
 * @param x: coordinates x of the message in the scene
 * @param y: coordinates y of the message in the scene
 */
export interface guestBookCommentary {
  user: string;
  message: string;
  date: Date;
  x: number;
  y: number;
  newComment?: boolean;
}
