import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const AskApiHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const askApiPrefix = '/ask:';
    if (req.url.startsWith(askApiPrefix)) {
        const headers = req.headers.set('x-csrf', '1');

        req = req.clone({
            url: req.url.replace(askApiPrefix, environment.askApiBaseUrl),
            headers,
            withCredentials: true
        });
    }

    return next(req);
}