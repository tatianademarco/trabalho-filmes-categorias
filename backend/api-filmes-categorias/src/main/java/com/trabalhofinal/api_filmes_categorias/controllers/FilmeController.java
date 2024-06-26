package com.trabalhofinal.api_filmes_categorias.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trabalhofinal.api_filmes_categorias.entities.Categoria;
import com.trabalhofinal.api_filmes_categorias.entities.Filme;
import com.trabalhofinal.api_filmes_categorias.services.FilmeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping(value= "/filmes")
public class FilmeController {

    String uploadDir = "C:/Users/tatim/Pictures/imagensTrabalhoWeb";

    @Autowired
    private FilmeService service;

    @GetMapping
    public ResponseEntity<List<Filme>> findAll() {
        List<Filme> result = service.findAll();

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Filme> findById(@PathVariable Long id) {

        Filme result = service.findById(id);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Filme> create(
            @RequestParam("nome") String nome,
            @RequestParam("data_lancamento") String dataLancamento,
            @RequestParam("descricao") String descricao,
            @RequestParam("pais_origem") String paisOrigem,
            @RequestParam("duracao_minutos") int duracaoMinutos,
            @RequestParam("classificacao_indicativa") String classificacaoIndicativa,
            @RequestParam("trailerUrl") String trailerUrl,
            @RequestParam("categorias") String categorias,
            @RequestParam("imagem") MultipartFile imagem) throws IOException {

        String originalFilename = imagem.getOriginalFilename();
        String filePath = Paths.get(uploadDir, originalFilename).toString();

        // Ensure the directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file to the file system
        try (OutputStream os = new FileOutputStream(filePath)) {
            os.write(imagem.getBytes());
        }
        // Convertendo a string JSON das categorias para uma lista de categorias
        ObjectMapper mapper = new ObjectMapper();
        List<Categoria> categoriaList = mapper.readValue(categorias, new TypeReference<List<Categoria>>() {});

        Filme filme = new Filme();
        filme.setNome(nome);
        filme.setData_lancamento(LocalDate.parse(dataLancamento));
        filme.setDescricao(descricao);
        filme.setPais_origem(paisOrigem);
        filme.setDuracao_minutos(duracaoMinutos);
        filme.setClassificacao_indicativa(classificacaoIndicativa);
        filme.setTrailerUrl(trailerUrl);
        filme.setCategorias(new HashSet<>(categoriaList));
        filme.setImagem(originalFilename);

        Filme result = service.create(filme);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<Filme> update(
            @PathVariable Long id,
            @RequestParam("nome") String nome,
            @RequestParam("data_lancamento") String dataLancamento,
            @RequestParam("descricao") String descricao,
            @RequestParam("pais_origem") String paisOrigem,
            @RequestParam("duracao_minutos") int duracaoMinutos,
            @RequestParam("classificacao_indicativa") String classificacaoIndicativa,
            @RequestParam("trailerUrl") String trailerUrl,
            @RequestParam("categorias") String categorias,
            @RequestParam("imagem") MultipartFile imagem) throws IOException {


        // Convertendo a string JSON das categorias para uma lista de categorias
        ObjectMapper mapper = new ObjectMapper();
        List<Categoria> categoriaList = mapper.readValue(categorias, new TypeReference<List<Categoria>>() {});

        Filme filme = new Filme();
        filme.setNome(nome);
        filme.setData_lancamento(LocalDate.parse(dataLancamento));
        filme.setDescricao(descricao);
        filme.setPais_origem(paisOrigem);
        filme.setDuracao_minutos(duracaoMinutos);
        filme.setClassificacao_indicativa(classificacaoIndicativa);
        filme.setTrailerUrl(trailerUrl);
        filme.setCategorias(new HashSet<>(categoriaList));

        // Implementar a lógica para buscar o filme pelo ID, atualizar os campos e salvar as mudanças
        // Lógica similar ao que você fez no método de criação
        if (imagem != null && !imagem.isEmpty()) {
            String originalFilename = imagem.getOriginalFilename();
            String filePath = Paths.get(uploadDir, originalFilename).toString();

            // Ensure the directory exists
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save the file to the file system
            try (OutputStream os = new FileOutputStream(filePath)) {
                os.write(imagem.getBytes());
            }
            filme.setImagem(originalFilename);
        } else {
            Filme filmeOriginal = service.findById(id);
            filme.setImagem(filmeOriginal.getImagem());
        }

        // Atualizar e salvar o filme
        Filme result = service.update(id, filme);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping(value = "/uploads/{imagem}")
    public ResponseEntity<byte[]> retornarImagem(@PathVariable("imagem") String imagem) {
        try {
            if (imagem == null || imagem.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            File imagemArquivo = new File(uploadDir + File.separator + imagem);

            if (!imagemArquivo.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            byte[] imagemBytes = Files.readAllBytes(imagemArquivo.toPath());
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", Files.probeContentType(imagemArquivo.toPath()));

            return new ResponseEntity<>(imagemBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "/categoria/{categoriaNome}")
    public ResponseEntity<List<Filme>> findByCategoria(@PathVariable("categoriaNome") String categoriaNome) {
        List<Filme> filmes = service.findByCategoriaNome(categoriaNome);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(filmes);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Filme>> searchFilmes(@RequestParam("query") String query) {
        List<Filme> filmes = service.searchByNome(query);
        return ResponseEntity.ok(filmes);
    }

}
