import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: 'login', component: LoginComponent }
        ],
    }
];
