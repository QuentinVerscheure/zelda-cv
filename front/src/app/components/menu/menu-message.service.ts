import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuMessageService {
  private authMessageSubject = new Subject<string>();
  authMessage$ = this.authMessageSubject.asObservable();

  showAuthMessage(message: string) {
    this.authMessageSubject.next(message);
  }
}