import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { firstValueFrom, tap, catchError, of } from 'rxjs';

export type User = {
  isLoggedIn: boolean,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpClient = inject(HttpClient);
  router = inject(Router);

  user = computed<User>(() => {
    const user = this._user();
    
    if(user === null) {
      return {
        isLoggedIn: false,
        name: ''
      }
    }

    return {
      isLoggedIn: true,
      name: user.find(c => c.type === 'name')?.value as  string
    }
  });

  private _user = signal<{ type: string, value: string | number }[] | null>(null);

  getUser() {
    return firstValueFrom(this.httpClient.get('ask:/bff/user').pipe(tap((res: any) => {
      this._user.set(res);
    }), catchError(error => {
      console.log('error get user', error);
      return of(null);
    })));
  }

  login() {
    window.location.href = `${environment.askApiBaseUrl}/bff/login?returnUrl=/agency-portal`;
  }

  logout() {
    const user = this._user();
    if (user === null)
      return;

    const logoutUrl = user.find(c => c.type === 'bff:logout_url');
    window.location.href = `${environment.askApiBaseUrl}${logoutUrl?.value}&returnUrl=/agency-portal`;
  }
}

export const AuthGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const user = await userService.getUser();

  if (user !== null) {
    return true;
  }

  return inject(Router).createUrlTree([environment.askApiBaseUrl, "/bff/login"], { queryParams: { returnUrl: '/agency-portal' } });
};