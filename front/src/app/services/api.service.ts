// Service Angular pour gérer les appels à une API

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CommentCreateDTO,
  CommentUpdateDTO,
  CommentVerifyResponseDTO,
} from '../models/dto/comment.dto';
import { MailDTO } from '../models/dto/mail.dto';
import { GuestBookDto } from '../models/dto/guestBook.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllComments(): Observable<GuestBookDto[]> {
    return this.http.get<GuestBookDto[]>(`${this.baseUrl}/comments`);
  }

  createComment(comment: CommentCreateDTO): Observable<GuestBookDto> {
    return this.http.post<GuestBookDto>(`${this.baseUrl}/comments`, comment);
  }

  /** true if the password allows editing the comment (right password, edit window still open). */
  verifyCommentPassword(id: number, password: string): Observable<CommentVerifyResponseDTO> {
    return this.http.post<CommentVerifyResponseDTO>(
      `${this.baseUrl}/comments/${id}/verify`,
      { password }
    );
  }

  updateComment(id: number, comment: CommentUpdateDTO): Observable<GuestBookDto> {
    return this.http.put<GuestBookDto>(`${this.baseUrl}/comments/${id}`, comment);
  }

  deleteComment(id: number, password: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}`, {
      headers: new HttpHeaders({ 'X-Comment-Password': password }),
    });
  }

  sendMailToOwner(mail: MailDTO): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/sendMailToOwner/`, mail);
  }
}
