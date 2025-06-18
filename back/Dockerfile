FROM eclipse-temurin:23-jdk-alpine

WORKDIR /app
COPY back/target/*.jar app.jar
COPY data /app/data
ENV SPRING_PROFILES_ACTIVE=prod

#EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]