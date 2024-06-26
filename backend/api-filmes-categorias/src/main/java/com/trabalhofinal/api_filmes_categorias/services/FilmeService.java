package com.trabalhofinal.api_filmes_categorias.services;

import com.trabalhofinal.api_filmes_categorias.entities.Filme;
import com.trabalhofinal.api_filmes_categorias.exceptions.FilmeNotFoundException;
import com.trabalhofinal.api_filmes_categorias.repositories.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilmeService {

    @Autowired
    private FilmeRepository repository;

    public List<Filme> findAll() {
        List<Filme> result = repository.findAll();
        return result;
    }

    public Filme findById(Long id) {
        Optional<Filme> result = repository.findById(id);
        if (result.isPresent()) {
            return result.get();
        }

        throw new FilmeNotFoundException();
    }

    public Filme create(Filme filme) {
        Filme result = repository.save(filme);
        return result;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Filme update(Long id, Filme newFilme) {
        Filme currentFilme = findById(id);
        currentFilme.setNome(newFilme.getNome());
        currentFilme.setDescricao(newFilme.getDescricao());
        currentFilme.setData_lancamento(newFilme.getData_lancamento());
        currentFilme.setImagem(newFilme.getImagem());
        currentFilme.setTrailerUrl(newFilme.getTrailerUrl());
        currentFilme.setClassificacao_indicativa(newFilme.getClassificacao_indicativa());
        currentFilme.setCategorias(newFilme.getCategorias());
        currentFilme.setDuracao_minutos(newFilme.getDuracao_minutos());
        currentFilme.setPais_origem(newFilme.getPais_origem());

        Filme filme = repository.save(currentFilme);
        return filme;
    }

    public List<Filme> findByCategoriaNome(String categoriaNome) {
        return repository.findByCategoriasNome(categoriaNome);
    }

    public List<Filme> searchByNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

}
