package com.trabalhofinal.api_filmes_categorias.services;

import com.trabalhofinal.api_filmes_categorias.entities.Categoria;
import com.trabalhofinal.api_filmes_categorias.exceptions.CategoriaNotFoundException;
import com.trabalhofinal.api_filmes_categorias.repositories.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoriaServiceTest {
    @Mock
    private CategoriaRepository repository;

    @InjectMocks
    private CategoriaService service;

    private Categoria categoria;

    @BeforeEach
    public void setup() {
        categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Ação");
    }

    @Test
    public void testFindAll() {
        when(repository.findAll()).thenReturn(Arrays.asList(categoria));
        List<Categoria> result = service.findAll();
        assertEquals(1, result.size());
        assertEquals("Ação", result.get(0).getNome());
    }

    @Test
    public void testFindById() {
        when(repository.findById(1L)).thenReturn(Optional.of(categoria));
        Categoria result = service.findById(1L);
        assertEquals("Ação", result.getNome());
    }

    @Test
    public void testFindByIdNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(CategoriaNotFoundException.class, () -> service.findById(1L));
    }

    @Test
    public void testCreate() {
        when(repository.save(categoria)).thenReturn(categoria);
        Categoria result = service.create(categoria);
        assertEquals("Ação", result.getNome());
    }

    @Test
    public void testDelete() {
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    public void testUpdate() {
        Categoria newCategoria = new Categoria();
        newCategoria.setNome("Comédia");

        when(repository.findById(1L)).thenReturn(Optional.of(categoria));
        when(repository.save(categoria)).thenReturn(categoria);

        Categoria result = service.update(1L, newCategoria);
        assertEquals("Comédia", result.getNome());
    }

    @Test
    public void testFindByName() {
        when(repository.findByNome("Ação")).thenReturn(Optional.of(categoria));
        Categoria result = service.findByName("Ação");
        assertEquals("Ação", result.getNome());
    }
}
