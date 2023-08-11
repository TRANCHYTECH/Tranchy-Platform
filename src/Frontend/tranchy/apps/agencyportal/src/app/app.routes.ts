import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.ROUTES)
    }
];
