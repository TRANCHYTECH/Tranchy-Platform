#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Backend/global.json", "Backend/"]
COPY ["Backend/Directory.Packages.props", "Backend/"]
COPY ["Backend/Directory.Build.props", "Backend/"]

COPY ["Backend/Tranchy.Ask.API/Tranchy.Ask.API.csproj", "Backend/Tranchy.Ask.API/"]
COPY ["Backend/Tranchy.Common/Tranchy.Common.csproj", "Backend/Tranchy.Common/"]
COPY ["Backend/Tranchy.Payment/Tranchy.Payment.csproj", "Backend/Tranchy.Payment/"]
COPY ["Backend/Tranchy.Question/Tranchy.Question.csproj", "Backend/Tranchy.Question/"]
COPY ["Backend/Tranchy.File/Tranchy.File.csproj", "Backend/Tranchy.File/"]

COPY ["Backend/Tranchy.Ask.API/packages.lock.json", "Backend/Tranchy.Ask.API/"]
COPY ["Backend/Tranchy.Common/packages.lock.json", "Backend/Tranchy.Common/"]
COPY ["Backend/Tranchy.Payment/packages.lock.json", "Backend/Tranchy.Payment/"]
COPY ["Backend/Tranchy.Question/packages.lock.json", "Backend/Tranchy.Question/"]
COPY ["Backend/Tranchy.File/packages.lock.json", "Backend/Tranchy.File/"]

RUN dotnet restore "Backend/Tranchy.Ask.API/Tranchy.Ask.API.csproj"
COPY . .
WORKDIR "/src/Backend/Tranchy.Ask.API"
RUN dotnet build "Tranchy.Ask.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tranchy.Ask.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tranchy.Ask.API.dll"]