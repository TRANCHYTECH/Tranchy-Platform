    Oppen power shell:
    dotnet dev-certs https -ep "$env:USERPROFILE\.aspnet\https\tranchyone.pem" --format Pem --no-password
    dotnet dev-certs https --trust