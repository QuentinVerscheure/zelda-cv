import { GuestBookDto } from "./dto/guestBook.dto";

export interface GuestBookComment extends GuestBookDto{
  newComment?: boolean;
}