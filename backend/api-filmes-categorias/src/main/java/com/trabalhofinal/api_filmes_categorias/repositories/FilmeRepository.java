package com.trabalhofinal.api_filmes_categorias.repositories;

import com.trabalhofinal.api_filmes_categorias.entities.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FilmeRepository extends JpaRepository<Filme, Long> {

    List<Filme> findByCategoriasNome(String nomeCategoria);

    List<Filme> findByNomeContainingIgnoreCase(String nome);

}
