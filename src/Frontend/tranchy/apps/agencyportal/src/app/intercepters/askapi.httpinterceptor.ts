import { HttpInterceptorFn } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../environments/environment";

export const AskApiHttpInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('request', req.method, req.url);
    console.log('authInterceptor')

    if (req.url.startsWith('[ASK]')) {
        const headers = req.headers.set('x-csrf', '1');

        req = req.clone({
            url: req.url.replace('[ASK]', environment.askApiBaseUrl),
            headers,
            withCredentials: true
        });
    }

    return next(req).pipe(
        tap(resp => console.log('response', resp))
    );
}