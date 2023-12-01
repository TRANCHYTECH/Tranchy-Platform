#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/asp:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Directory.Build.props", "."]
COPY ["Tranchy.Ask.Worker/Tranchy.Ask.Worker.csproj", "Tranchy.Ask.Worker/"]
COPY ["Tranchy.Payment/Tranchy.Payment.csproj", "Tranchy.Payment/"]
COPY ["Tranchy.Common/Tranchy.Common.csproj", "Tranchy.Common/"]
COPY ["Tranchy.Question/Tranchy.Question.csproj", "Tranchy.Question/"]


COPY ["Tranchy.Ask.Worker/packages.lock.json", "Tranchy.Ask.Worker/"]
COPY ["Tranchy.Payment/packages.lock.json", "Tranchy.Payment/"]
COPY ["Tranchy.Common/packages.lock.json", "Tranchy.Common/"]
COPY ["Tranchy.Question/packages.lock.json", "Tranchy.Question/"]

RUN dotnet restore "./Tranchy.Ask.Worker/./Tranchy.Ask.Worker.csproj"
COPY . .
WORKDIR "/src/Tranchy.Ask.Worker"
RUN dotnet build "./Tranchy.Ask.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Tranchy.Ask.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tranchy.Ask.Worker.dll"]
