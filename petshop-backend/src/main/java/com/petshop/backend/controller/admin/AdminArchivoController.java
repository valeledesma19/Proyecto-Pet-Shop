package com.petshop.backend.controller.admin;

import com.petshop.backend.dto.archivo.ArchivoSubidoDTO;
import com.petshop.backend.exception.BadRequestException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/archivos")
@RequiredArgsConstructor
@Tag(name = "Admin - Archivos", description = "Carga de imagenes (requiere ROLE_ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminArchivoController {

    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/webp");

    @Value("${petshop.uploads.dir}")
    private String uploadsDir;

    @PostMapping(value = "/imagenes", consumes = "multipart/form-data")
    @Operation(summary = "Subir una imagen (producto, categoria o marca) y obtener su URL publica")
    public ResponseEntity<ArchivoSubidoDTO> subirImagen(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("El archivo esta vacio");
        }
        if (!TIPOS_PERMITIDOS.contains(file.getContentType())) {
            throw new BadRequestException("Formato no permitido. Usa JPG, PNG o WEBP");
        }

        String extension = extensionDe(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID() + extension;

        Path carpetaDestino = Paths.get(uploadsDir, "productos").toAbsolutePath().normalize();
        Files.createDirectories(carpetaDestino);

        Path destino = carpetaDestino.resolve(nombreArchivo);
        Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/productos/" + nombreArchivo;
        return ResponseEntity.status(HttpStatus.CREATED).body(new ArchivoSubidoDTO(url));
    }

    private String extensionDe(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) return "";
        return nombreOriginal.substring(nombreOriginal.lastIndexOf('.'));
    }
}