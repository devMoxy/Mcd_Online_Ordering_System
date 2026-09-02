# --- Stage 1: build the jar ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first so Docker can cache dependency downloads separately from source changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: run the jar ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]