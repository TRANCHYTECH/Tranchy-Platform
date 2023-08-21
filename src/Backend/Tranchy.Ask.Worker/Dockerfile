#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Backend/global.json", "global.json"]
COPY ["Backend/Tranchy.Ask.Worker/Tranchy.Ask.Worker.csproj", "Backend/Tranchy.Ask.Worker/"]
COPY ["Backend/Tranchy.Question/Tranchy.Question.csproj", "Backend/Tranchy.Question/"]
RUN dotnet restore "Backend/Tranchy.Ask.Worker/Tranchy.Ask.Worker.csproj"
COPY . .
WORKDIR "/src/Backend/Tranchy.Ask.Worker"
RUN dotnet build "Tranchy.Ask.Worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tranchy.Ask.Worker.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tranchy.Ask.Worker.dll"]