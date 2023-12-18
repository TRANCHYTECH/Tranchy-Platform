import { Route } from '@angular/router';
import { AuthGuard } from '@tranchy/core';
import { LayoutComponent } from './_layouts/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
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
      {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then((m) => m.ROUTES),
        canActivate: [AuthGuard],
      },
    ],
  },
];
