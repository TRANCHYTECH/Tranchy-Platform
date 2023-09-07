import { Route } from "@angular/router";
import { AgencyProfileComponent } from "./agency-profile/agency-profile.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: 'profile', component: AgencyProfileComponent }
        ],
    }
];