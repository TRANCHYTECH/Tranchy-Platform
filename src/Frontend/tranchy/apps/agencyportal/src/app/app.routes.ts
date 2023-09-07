import { Route } from '@angular/router';
import { AuthGuard } from './core/services/user.service';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'setting',
        loadChildren: () => import('./setting/setting.routes').then(m => m.ROUTES),
        //canActivate: [AuthGuard]
    }
];
