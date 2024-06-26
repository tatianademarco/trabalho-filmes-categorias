package com.trabalhofinal.api_filmes_categorias.exceptions;

public class FilmeNotFoundException extends RuntimeException{

    public FilmeNotFoundException() {
        super("Filme não encontrado!");
    }

    public FilmeNotFoundException(String msg) {
        super(msg);
    }
}
