package com.trabalhofinal.api_filmes_categorias.controllers;

import com.trabalhofinal.api_filmes_categorias.entities.Categoria;
import com.trabalhofinal.api_filmes_categorias.repositories.CategoriaRepository;
import com.trabalhofinal.api_filmes_categorias.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping(value= "/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    @GetMapping
    public ResponseEntity<List<Categoria>> findAll(){
        List<Categoria> result = service.findAll();
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Categoria> findById(@PathVariable Long id){

        Categoria result = service.findById(id);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @PostMapping
    public ResponseEntity<Categoria> create(@RequestBody Categoria categoria){

        Categoria result = service.create(categoria);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id){

        try {
            service.delete(id);
            return ResponseEntity.ok().body("Categoria excluída com sucesso!");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não é possível excluir a categoria, pois ela está relacionada a um ou mais filmes.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir categoria.");
        }
//        service.delete(id);
//        return  ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Categoria> update(@PathVariable Long id,
                                            @RequestBody Categoria newCategoria){
        Categoria categoria = service.update(id, newCategoria);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(categoria);
    }

    @GetMapping(value = "/nome/{nome}")
    public ResponseEntity<Categoria> findByName(@PathVariable String nome){
        Categoria result = service.findByName(nome);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }
}
