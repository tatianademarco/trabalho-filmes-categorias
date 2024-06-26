$(document).ready(function() {

    let imagemOriginal = null;

    $('#categories').chosen({
        placeholder_text_multiple: "Selecione uma ou mais categorias"
    });

    $("#input-b6a").fileinput({
        showUpload: false,
        dropZoneEnabled: false,
        maxFileCount: 1,
        inputGroupClass: "input-group-lg",
        browseLabel: 'Escolher Arquivo',
        msgPlaceholder: 'Selecione um arquivo'
    });


    // Função para abrir o tipo de formulário, cadastro ou edição
    function openForm(title, filme) {
        $('#formTitle').text(title);
        if (filme) {
            $('#nome').val(filme.nome);
            $('#data_lancamento').val(filme.data_lancamento);
            $('#descricao').val(filme.descricao);
            $('#pais').val(filme.pais_origem);
            $('#duracao_min').val(filme.duracao_minutos);
            $('#classificacao').val(filme.classificacao_indicativa);
            $('#url_trailer').val(filme.trailerUrl);

            imagemOriginal = filme.imagem;

            loadCategories(() => {
            // Setar categorias no chosen
            let categoriaNomes = filme.categorias.map(categoria => categoria.nome);
            $('#categories').val(categoriaNomes);
            $('#categories').trigger("chosen:updated");
        });
            
        } else {
            loadCategories(() => {
            $('#filmeForm')[0].reset();
        });
        }
    }

    // Carregar categorias ao carregar a página
    function loadCategories(callback) {
        $.ajax({
            url: 'http://localhost:8080/categorias',
            type: 'GET',
            contentType: 'application/json',
            success: function(response) {
                const select = document.getElementById('categories');
                select.innerHTML = ''; // Limpa as opções existentes
                response.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.nome;
                    option.textContent = categoria.nome;
                    select.appendChild(option);
                });
                $('#categories').trigger("chosen:updated"); // Atualiza o chosen select

                if (callback) callback();
            },
            error: function(error) {
                console.error('Erro ao carregar categorias:', error);
            }
        });
    }

    // Evento de submit do formulário de filme
    $('#filmeForm').on('submit', function(event) {
        event.preventDefault();    

        let formData = new FormData();
        formData.append('nome', $('#nome').val());
        formData.append('data_lancamento', $('#data_lancamento').val());
        formData.append('descricao', $('#descricao').val());
        formData.append('pais_origem', $('#pais').val());
        formData.append('duracao_minutos', $('#duracao_min').val());
        formData.append('classificacao_indicativa', $('#classificacao').val());

        const urlObj = new URL($('#url_trailer').val());

        // Ver se URL valida
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            if (urlObj.pathname === '/watch') {
                formData.append('trailerUrl', $('#url_trailer').val())
            } else if (urlObj.pathname.startsWith('/embed/')) {
                formData.append('trailerUrl', $('#url_trailer').val())
            } else if (urlObj.pathname.startsWith('/v/')) {
                formData.append('trailerUrl', $('#url_trailer').val())
            }
        } else if (urlObj.hostname === 'youtu.be') {
            formData.append('trailerUrl', $('#url_trailer').val())
        } else {
            alert('Por favor, insira um URL válido do YouTube.');
        }

        const imagemInput = $('#input-b6a')[0];
        if (imagemInput && imagemInput.files.length > 0) {
            let imagem = imagemInput.files[0];
            formData.append('imagem', imagem);
        } else {
            formData.append('imagem', new Blob(), '');
        }

        let categorias = $('#categories').val(); // Pega as categorias selecionadas
        let categoriaPromises = categorias.map(categoria => {
            return $.ajax({
                url: `http://localhost:8080/categorias/nome/${categoria}`,
                type: 'GET'
            });
        });

        Promise.all(categoriaPromises).then(results => {
            let categoriaIds = results.map(categoria => categoria.id);
            let categoriasJson = JSON.stringify(categoriaIds.map(id => ({ id: id })));
            formData.append('categorias', categoriasJson);

            const url = id ? `http://localhost:8080/filmes/${id}` : 'http://localhost:8080/filmes';
            const type = id ? 'PUT' : 'POST';

            $.ajax({
                url: url,
                type: type,
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('Filme salvo com sucesso!');
                    window.location.href = `info_filme.html?id=${response.id}`;
                },
                error: function(error) {
                    console.error('Erro ao salvar filme:', error);
                    alert('Erro ao salvar filme.');
                }
            });
        }).catch(error => {
            console.error('Erro ao buscar categorias:', error);
            alert('Erro ao buscar categorias.');
        });
    });

    // Evento de click para salvar nova categoria
    $('#salvar-categoria').on('click', function() {
        var categoryName = $('#category-name').val();

        if (categoryName.trim() === '') {
            alert('Por favor, informe o nome da categoria.');
            return;
        }

        // Verifica se a categoria já existe
        $.ajax({
            url: `http://localhost:8080/categorias/nome/${categoryName}`,
            type: 'GET',
            success: function(response) {
                if (response) {
                    alert('Categoria já existe!');
                } else {
                    var novaCategoria = {
                        nome: categoryName
                    };

                    $.ajax({
                        url: 'http://localhost:8080/categorias',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(novaCategoria),
                        success: function(response) {
                            alert('Categoria cadastrada com sucesso!');

                            $('#category-name').val('');
                            $('#exampleModal').modal('hide');

                            const select = document.getElementById('categories');
                            const option = document.createElement('option');
                            option.value = response.nome;
                            option.textContent = response.nome;
                            select.appendChild(option);
                            $('#categories').trigger("chosen:updated"); // Atualiza o chosen select
                        },
                        error: function(error) {
                            console.error('Erro ao cadastrar categoria:', error);
                            alert('Erro ao cadastrar categoria.');
                        }
                    });
                }
            },
            error: function(error) {
                if (error.status === 500) {
                    var novaCategoria = {
                        nome: categoryName
                    };

                    $.ajax({
                        url: 'http://localhost:8080/categorias',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(novaCategoria),
                        success: function(response) {
                            alert('Categoria cadastrada com sucesso!');

                            $('#category-name').val('');
                            $('#exampleModal').modal('hide');

                            const select = document.getElementById('categories');
                            const option = document.createElement('option');
                            option.value = response.nome;
                            option.textContent = response.nome;
                            select.appendChild(option);
                            $('#categories').trigger("chosen:updated"); // Atualiza o chosen select
                        },
                        error: function(error) {
                            console.error('Erro ao cadastrar categoria:', error);
                            alert('Erro ao cadastrar categoria.');
                        }
                    });
                } else {
                    console.error('Erro ao verificar categoria:', error);
                    alert('Erro ao verificar categoria.');
                }
            }
        });
    });

        const id = new URLSearchParams(window.location.search).get('id');
        console.log(id);
        if (id) {
        $.ajax({
            url: `http://localhost:8080/filmes/${id}`,
            type: 'GET',
            contentType: 'application/json',
            success: function(response) {
                openForm('Editar Filme', response);
            },
            error: function(error) {
                console.error('Erro ao buscar detalhes do filme para edição:', error);
            }
        });
    } else {
        openForm('Cadastrar Filme');
    };
});
