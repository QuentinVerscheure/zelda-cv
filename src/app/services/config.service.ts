import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap } from 'rxjs';
import { AppConfig } from '../models/config.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<AppConfig | undefined>(undefined);
  config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('assets/config.json').pipe(
      catchError(error => {
        console.error('Failed to load configuration', error);
        return of({
          debugMode: false,
          me: {
            menuName: 'Default',
            cvName: 'CV',
            mail: 'Default'
          }
        });
      }),
      tap(config => this.configSubject.next(config))  // Emit the loaded config
    );
  }

  getConfig(): AppConfig | undefined {
    return this.configSubject.value;
  }
}
