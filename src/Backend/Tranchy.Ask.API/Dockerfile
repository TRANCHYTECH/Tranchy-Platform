#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["global.json", "."]
COPY ["Directory.Packages.props", "."]
COPY ["Directory.Build.props", "."]
COPY ["Tranchy.Ask.API/Tranchy.Ask.API.csproj", "Tranchy.Ask.API/"]
COPY ["Tranchy.Common/Tranchy.Common.csproj", "Tranchy.Common/"]
COPY ["Tranchy.Payment/Tranchy.Payment.csproj", "Tranchy.Payment/"]
COPY ["Tranchy.Question/Tranchy.Question.csproj", "Tranchy.Question/"]
COPY ["Tranchy.File/Tranchy.File.csproj", "Tranchy.File/"]
COPY ["Tranchy.User/Tranchy.User.csproj", "Tranchy.User/"]

COPY ["Tranchy.Ask.API/packages.lock.json", "Tranchy.Ask.API/"]
COPY ["Tranchy.Common/packages.lock.json", "Tranchy.Common/"]
COPY ["Tranchy.Payment/packages.lock.json", "Tranchy.Payment/"]
COPY ["Tranchy.Question/packages.lock.json", "Tranchy.Question/"]
COPY ["Tranchy.File/packages.lock.json", "Tranchy.File/"]
COPY ["Tranchy.User/packages.lock.json", "Tranchy.User/"]

RUN dotnet restore "./Tranchy.Ask.API/./Tranchy.Ask.API.csproj"
COPY . .
WORKDIR "/src/Tranchy.Ask.API"
RUN dotnet build "./Tranchy.Ask.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Tranchy.Ask.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tranchy.Ask.API.dll"]
