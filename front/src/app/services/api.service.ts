// Service Angular pour gérer les appels à une API

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommentDTO } from '../models/dto/comment.dto';
import { UserDTO } from '../models/user.model';
import { MailDTO } from '../models/dto/mail.dto';
import { LoginDTO, LoginResponseDTO } from '../models/dto/login.dto';
import { Achievement } from '../models/achievement.model';

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
  getAllComments(): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.baseUrl}/comments`);
  }

  createComment(comment: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(
      `${this.baseUrl}/comments`,
      comment,
      { headers: this.getAuthHeaders() }
    );
  }

  updateComment(id: number, comment: CommentDTO): Observable<CommentDTO> {
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

  // --- User APIs ---
  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/users/${id}`);
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
      `${this.baseUrl}/achievements/update`,
      achievement,
      { headers: this.getAuthHeaders() }
    );
  }

  getUserAchievement(id: number): Observable<Achievement> {
    return this.http.get<Achievement>(
      `${this.baseUrl}/achievements/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getDiffTypeOfAchievement(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/achievements/getDiffTypeOfAchievement`);
  }

  login(credentials: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/auth/login`, credentials);
  }
}
