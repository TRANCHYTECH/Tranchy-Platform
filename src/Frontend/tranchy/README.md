## Receipts

### Generate standalone component:

nx generate @nx/angular:component --standalone --name=home --project=agencyportal --changeDetection=OnPush --displayBlock=true --path=apps/agencyportal/src/app/dashboard --skipTests=true

npx nx generate @nx/angular:library shared

### Translation

https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate

Oppen power shell:
dotnet dev-certs https -ep "$env:USERPROFILE\.aspnet\https\tranchyone.pem" --format Pem --no-password
dotnet dev-certs https --trust
