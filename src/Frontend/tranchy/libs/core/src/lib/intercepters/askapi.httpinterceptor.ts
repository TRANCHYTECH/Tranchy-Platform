import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { CORE_CONFIG } from "../core.config";

export const AskApiHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const coreConfig = inject(CORE_CONFIG);
    const askApiPrefix = '/ask:';
    if (req.url.startsWith(askApiPrefix)) {
        const headers = req.headers.set('x-csrf', '1');

        req = req.clone({
            url: req.url.replace(askApiPrefix, coreConfig.askApiBaseUrl),
            headers,
            withCredentials: true
        });
    }

    return next(req);
}