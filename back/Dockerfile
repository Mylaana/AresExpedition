# Étape 1 : Build avec Maven
FROM maven:3.9.9-eclipse-temurin-24-alpine AS build

WORKDIR /app
COPY back/pom.xml back/
COPY back/src back/src/
RUN mvn -f back/pom.xml clean package -DskipTests

# Étape 2 : Exécution avec JDK allégé
FROM eclipse-temurin:24-jdk-alpine

WORKDIR /app
COPY --from=build /app/back/target/*.jar app.jar
COPY data /app/data
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]