package com.trabalhofinal.api_filmes_categorias.services;

import com.trabalhofinal.api_filmes_categorias.entities.Categoria;
import com.trabalhofinal.api_filmes_categorias.exceptions.CategoriaNotFoundException;
import com.trabalhofinal.api_filmes_categorias.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public List<Categoria> findAll() {
        List<Categoria> result = repository.findAll();
        return result;
    }

    public Categoria findById(Long id) {
        Optional<Categoria> result = repository.findById(id);
        if (result.isPresent()) {
            return result.get();
        }

        throw new CategoriaNotFoundException();
    }

    public Categoria create(Categoria categoria) {
        Categoria result = repository.save(categoria);
        return result;
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public Categoria update(Long id, Categoria newCoategoria){
        Categoria currentCategoria = findById(id);

        currentCategoria.setNome(newCoategoria.getNome());

        Categoria categoria = repository.save(currentCategoria);
        return categoria;
    }

    public Categoria findByName(String nome){
        Optional<Categoria> result = repository.findByNome(nome);
        if (result.isPresent()) {
            return result.get();
        }

        throw new CategoriaNotFoundException();
    }
}
