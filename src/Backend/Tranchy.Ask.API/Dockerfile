#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["global.json", "global.json"]
COPY ["Tranchy.Ask.API/Tranchy.Ask.API.csproj", "Tranchy.Ask.API/"]
COPY ["Tranchy.Common/Tranchy.Common.csproj", "Tranchy.Common/"]
COPY ["Tranchy.Question/Tranchy.Question.csproj", "Tranchy.Question/"]
RUN dotnet restore "Tranchy.Ask.API/Tranchy.Ask.API.csproj"
COPY . .
WORKDIR "/src/Tranchy.Ask.API"
RUN dotnet build "Tranchy.Ask.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tranchy.Ask.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tranchy.Ask.API.dll"]