import { Route } from "@angular/router";
import { QuestionListComponent } from "./question-list/question-list.component";

export const ROUTES: Route[] = [
    {
        path: '',
        providers: [],
        children: [
            { path: 'question-list', component: QuestionListComponent }
        ],
    }
];
