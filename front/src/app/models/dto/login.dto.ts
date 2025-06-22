import { Achievement } from '../achievement.model';
import { UserDTO } from '../user.model';

export interface LoginDTO {
  pseudo: string;
  pass: string;
  achievement?: Achievement;
}
export interface LoginResponseDTO {
  accessToken: string;
  status: string;
  user: UserDTO;
}
