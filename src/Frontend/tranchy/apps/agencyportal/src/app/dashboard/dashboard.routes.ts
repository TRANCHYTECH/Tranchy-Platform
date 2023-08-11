import { Route } from "@angular/router";
import { HomeComponent } from "./home/home.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: '', component: HomeComponent }
        ],
    }
];