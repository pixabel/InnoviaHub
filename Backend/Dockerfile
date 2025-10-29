# Build stage: .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj(s) and restore without cache to avoid using any stale cached references
COPY *.csproj ./
RUN dotnet restore --no-cache

# Copy the rest of the source and publish
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage: .NET 8 runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Listen on port 5000 (App Platform should route to this port)
ENV ASPNETCORE_URLS=http://+:5000

# Copy published output
COPY --from=build /app/out ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "Backend.dll"]