import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AskApiHttpInterceptor, CoreConfig, provideCore } from '@tranchy/core';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { SharedModule } from '@tranchy/shared';
import { AppLayoutModule } from './layout/app.layout.module';

export interface PortalConfig extends CoreConfig {
  production: boolean;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([AskApiHttpInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      AppLayoutModule,
      SharedModule.forRoot()
    ),
    provideCore(environment),
  ],
};

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
