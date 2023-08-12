import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const AskApiHttpInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith('ask:')) {
        const headers = req.headers.set('x-csrf', '1');

        req = req.clone({
            url: req.url.replace('ask:', environment.askApiBaseUrl),
            headers,
            withCredentials: true
        });
    }

    return next(req);
}