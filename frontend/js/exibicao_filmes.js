$(document).ready(function () {

    let idCategoria;

    function carregarFilmes(url) {
        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                const container = document.getElementById('filmes-container');
                container.innerHTML = ''; // Limpa as opções existentes

                if (response.length === 0) {
                    container.append('Nenhum filme encontrado.');
                    return;
                }

                response.forEach(filme => {
                    const col = document.createElement('div');
                    col.className = "col";

                    const p3 = document.createElement('div');
                    p3.className = "p-3";

                    const div = document.createElement('div');
                    div.className = "filme";

                    const imagem = filme.imagem;
                    const titulo = filme.nome;
                    const data = filme.data_lancamento;

                    const content = `<a href="info_filme.html?id=${filme.id}">
                                        <img src="http://localhost:8080/filmes/uploads/${imagem}" alt="Poster do filme">
                                        <h5>${titulo}</h5>
                                        <p>${new Date(data).toLocaleDateString()}</p>
                                    </a>`;
                    div.innerHTML = content;
                    p3.appendChild(div);
                    col.appendChild(p3);
                    container.appendChild(col);
                });
            },
            error: function (error) {
                console.error('Erro ao buscar filmes', error);
            }
        });
    }

    // Evento de click para editar categoria
    $('#salvar-categoria').on('click', function () {

        const categoriaNome = $('#category-name').val().trim();

        // Verifica se a categoria já existe
        $.ajax({
            url: `http://localhost:8080/categorias/nome/${categoriaNome}`,
            type: 'GET',
            success: function (response) {
                if (response) {
                    alert('Categoria já existe!');
                } else {
                    var novaCategoria = {
                        nome: categoriaNome
                    };

                    $.ajax({
                        url: `http://localhost:8080/categorias/${idCategoria}`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({ nome: categoriaNome }),
                        success: function (response) {
                            alert('Categoria alterada com sucesso!');
                            $('#exampleModal').modal('hide');
                            idCategoria = response.id;
                            window.location.href = `exibicao_filmes.html?categoria=${categoriaNome}`;
                        },
                        error: function (error) {
                            console.error('Erro ao alterar categoria:', error);
                            alert('Erro ao alterar categoria.');
                        }
                    });
                }
            },
            error: function (error) {
                if (error.status === 500) {
                    var novaCategoria = {
                        nome: categoriaNome
                    };

                    $.ajax({
                        url: `http://localhost:8080/categorias/${idCategoria}`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({ nome: categoriaNome }),
                        success: function (response) {
                            alert('Categoria alterada com sucesso!');
                            $('#exampleModal').modal('hide');
                            idCategoria = response.id;
                            window.location.href = `exibicao_filmes.html?categoria=${categoriaNome}`;
                        },
                        error: function (error) {
                            console.error('Erro ao alterar categoria:', error);
                            alert('Erro ao alterar categoria.');
                        }
                    });
                } else {
                    console.error('Erro ao verificar categoria:', error);
                    alert('Erro ao verificar categoria.');
                }
            }
        });
    });


    $(document).on('click', '#excluir-categoria', function () {

        if (confirm('Tem certeza que deseja excluir esta categoria?')) {

            $.ajax({
                url: `http://localhost:8080/categorias/${idCategoria}`,
                type: 'DELETE',
                success: function (response) {
                    alert(response);
                    window.location.href = `index.html`;
                },
                error: function (xhr) {
                    if (xhr.status === 409) { // Conflito devido a relacionamento com filmes
                        alert('Não é possível excluir a categoria, pois ela está relacionada a um ou mais filmes.');
                    } else {
                        console.error('Erro ao excluir categoria:', xhr);
                        alert('Erro ao excluir categoria.');
                        console.log(`Categoria atual: ${categoria}`);
                    }
                }
            });
        }
    });

    function atualizarIdCategoria(categoria) {
        $.ajax({
            url: `http://localhost:8080/categorias/nome/${categoria}`,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                idCategoria = response.id;
            },
            error: function (error) {
                console.error('Erro ao encontrar categoria:', error);
            }
        });
    }

    // Pega o parâmetro da URL para carregar os filmes da categoria
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    const query = urlParams.get('resultados');
    $('#category-name').val(categoria);

    console.log(query);

    if (query) {
        carregarFilmes(`http://localhost:8080/filmes/search?query=${query}`);
        document.querySelector('#titulo-filmes').textContent = "Resultado da Busca";
        document.querySelector('.icones').style.display = 'none';
    } else {
        if (categoria) {

            carregarFilmes(`http://localhost:8080/filmes/categoria/${categoria}`);
            document.querySelector('#titulo-filmes').textContent = categoria;

            //Pegar id da categoria
            atualizarIdCategoria(categoria);

        } else {
            carregarFilmes('http://localhost:8080/filmes');
            document.querySelector('#titulo-filmes').textContent = "Todos os Filmes";
            document.querySelector('.icones').style.display = 'none';
        }
    }


});
