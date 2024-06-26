package com.trabalhofinal.api_filmes_categorias.services;

import com.trabalhofinal.api_filmes_categorias.entities.Filme;
import com.trabalhofinal.api_filmes_categorias.exceptions.FilmeNotFoundException;
import com.trabalhofinal.api_filmes_categorias.repositories.FilmeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FilmeServiceTest {

    @Mock
    private FilmeRepository repository;

    @InjectMocks
    private FilmeService service;

    private Filme filme;

    @BeforeEach
    public void setup() {
        filme = new Filme();
        filme.setId(1L);
        filme.setNome("Test Film");
    }

    @Test
    public void testFindAll() {
        when(repository.findAll()).thenReturn(Arrays.asList(filme));
        List<Filme> result = service.findAll();
        assertEquals(1, result.size());
        assertEquals("Test Film", result.get(0).getNome());
    }

    @Test
    public void testFindById() {
        when(repository.findById(1L)).thenReturn(Optional.of(filme));
        Filme result = service.findById(1L);
        assertEquals("Test Film", result.getNome());
    }

    @Test
    public void testFindByIdNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(FilmeNotFoundException.class, () -> service.findById(1L));
    }

    @Test
    public void testCreate() {
        when(repository.save(filme)).thenReturn(filme);
        Filme result = service.create(filme);
        assertEquals("Test Film", result.getNome());
    }

    @Test
    public void testDelete() {
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    public void testUpdate() {
        Filme newFilme = new Filme();
        newFilme.setNome("Updated Film");

        when(repository.findById(1L)).thenReturn(Optional.of(filme));
        when(repository.save(filme)).thenReturn(filme);

        Filme result = service.update(1L, newFilme);
        assertEquals("Updated Film", result.getNome());
    }

    @Test
    public void testFindByCategoriaNome() {
        when(repository.findByCategoriasNome("Ação")).thenReturn(Arrays.asList(filme));
        List<Filme> result = service.findByCategoriaNome("Ação");
        assertEquals(1, result.size());
        assertEquals("Test Film", result.get(0).getNome());
    }
}