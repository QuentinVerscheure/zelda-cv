import { Achievement } from '../achievement.model';
import { UserDTO } from '../user.model';

export interface LoginDTO {
  pseudo: string;
  pass: string;
  achievement?: {
    cv: boolean;
    cvDownload: boolean;
    portfolio: boolean;
    link: boolean;
    linkClick: boolean;
    phone: boolean;
    phoneContact: boolean;
    guestBook: boolean;
    guestBookComment: boolean;
    achievementVarious: boolean;
    achievementCredit: boolean;
  };
}
export interface LoginResponseDTO {
  accessToken: string;
  status: string;
  user: UserDTO;
}
