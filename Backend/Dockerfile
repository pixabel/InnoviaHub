# Backend/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# copy csproj and restore
COPY *.csproj .
RUN dotnet restore

# copy everything else and build
COPY . .
RUN dotnet publish -c Release -o out

# final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# set environment variables
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Backend.dll"]
