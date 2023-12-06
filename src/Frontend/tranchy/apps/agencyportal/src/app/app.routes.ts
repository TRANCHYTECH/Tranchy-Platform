import { Route } from '@angular/router';
import { AuthGuard } from '@tranchy/core';
import { AppLayoutComponent } from './_layout/app.layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.ROUTES),
        canActivate: [AuthGuard],
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('./setting/setting.routes').then((m) => m.ROUTES),
        canActivate: [AuthGuard],
      },
    ],
  },
];
