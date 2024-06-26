package com.trabalhofinal.api_filmes_categorias.exceptions;

public class CategoriaNotFoundException extends RuntimeException{

    public CategoriaNotFoundException () {
        super("Categoria não encontrada!");
    }

    public CategoriaNotFoundException(String msg){
        super(msg);
    }
}
