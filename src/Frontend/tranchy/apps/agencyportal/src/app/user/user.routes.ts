import { Route } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { ExpertRequestListComponent } from "./expert-request-list/expert-request-list.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: 'user-list', component: UserListComponent },
            { path: 'expert-request-list', component: ExpertRequestListComponent },

        ],
    }
];
