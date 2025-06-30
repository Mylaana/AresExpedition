FROM maven:3.9.9-eclipse-temurin-24-alpine AS build

WORKDIR /app
COPY back/pom.xml back/
COPY back/src back/src/
RUN mvn -f back/pom.xml clean package -DskipTests

FROM eclipse-temurin:24-jdk-alpine

WORKDIR /app
COPY --from=build /app/back/target/*.jar app.jar
COPY data /app/data

ENTRYPOINT ["java", "-jar", "app.jar"]
