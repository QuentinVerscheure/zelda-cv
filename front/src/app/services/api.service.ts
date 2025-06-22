// Service Angular pour gérer les appels à une API

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommentDTO } from '../models/dto/comment.dto';
import { UserDTO } from '../models/user.model';
import { MailDTO } from '../models/dto/mail.dto';
import { LoginDTO, LoginResponseDTO } from '../models/dto/login.dto';
import { Achievement } from '../models/achievement.model';
import { GuestBookDto } from '../models/dto/guestBook.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // --- Comment APIs ---
  getAllComments(): Observable<GuestBookDto[]> {
    return this.http.get<GuestBookDto[]>(`${this.baseUrl}/comments`);
  }

  createComment(comment: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(
      `${this.baseUrl}/comments`,
      comment,
      { headers: this.getAuthHeaders() }
    );
  }

  updateComment(id: number, comment: CommentDTO): Observable<CommentDTO> {
    const headers = this.getAuthHeaders();
    // DEBUG: log temporaire pour vérifier le token
    return this.http.put<CommentDTO>(
      `${this.baseUrl}/comments/${id}`,
      comment,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/comments/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createUser(loginDTO: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/users`, loginDTO);
  }

  updateUser(user: UserDTO): Observable<LoginResponseDTO> {
    return this.http.put<LoginResponseDTO>(
      `${this.baseUrl}/users`,
      user,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/users`,
      { headers: this.getAuthHeaders() }
    );
  }

  sendMailToOwner(mail: MailDTO): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/sendMailToOwner/`, mail);
  }

  updateAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.put<Achievement>(
      `${this.baseUrl}/achievements`,
      achievement,
      { headers: this.getAuthHeaders() }
    );
  }

  getUserAchievement(): Observable<Achievement> {
    return this.http.get<Achievement>(
      `${this.baseUrl}/achievements`,
      { headers: this.getAuthHeaders() }
    );
  }

  login(credentials: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/auth/login`, credentials);
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(
      `${this.baseUrl}/users`,
      { headers: this.getAuthHeaders() }
    );
  }
}
