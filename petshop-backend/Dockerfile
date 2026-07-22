# ============================================================
# Etapa 1: build
# Compila el proyecto con Maven y genera el jar ejecutable.
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Se copia primero el pom.xml para aprovechar la cache de capas de Docker:
# si las dependencias no cambian, este layer no se vuelve a descargar.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ============================================================
# Etapa 2: runtime
# Imagen final liviana, solo con el JRE y el jar compilado.
# ============================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Usuario no root por seguridad
RUN addgroup -S petshop && adduser -S petshop -G petshop

COPY --from=build /app/target/petshop-backend-*.jar app.jar

# Directorio para imagenes subidas por el panel de administracion
RUN mkdir -p /app/uploads && chown -R petshop:petshop /app

USER petshop

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
