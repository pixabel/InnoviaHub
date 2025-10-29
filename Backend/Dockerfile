# Build stage: .NET 9 SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj(s) and restore
COPY *.csproj ./
RUN dotnet restore

# Copy source and publish
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage: .NET 9 runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Listen on port 5000
ENV ASPNETCORE_URLS=http://+:5000

COPY --from=build /app/out ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "Backend.dll"]