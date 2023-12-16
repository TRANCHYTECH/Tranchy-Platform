import { Route } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: 'user-list', component: UserListComponent }
        ],
    }
];
