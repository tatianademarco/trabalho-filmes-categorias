$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/categorias',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            const select = document.getElementById('opcoes-categoria');
            select.innerHTML = ''; // Limpa as opções existentes
            response.forEach(categoria => {
                const option = document.createElement('a');
                option.textContent = categoria.nome;
                option.className = "categoria-link";
                select.appendChild(option);
            });
        },
        error: function (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    });


    // Evento de clique para carregar todos os filmes
    $('#all-films-link').on('click', function (event) {
        event.preventDefault();
        window.location.href = 'exibicao_filmes.html?categoria=';
    });

    // Delegação de evento para carregar filmes por categoria
    $(document).on('click', '.categoria-link', function (event) {
        event.preventDefault();
        const categoria = $(this).text();
        window.location.href = `exibicao_filmes.html?categoria=${encodeURIComponent(categoria)}`;
    });

    $('.search-btn').on('click', function () {
        const query = $('.search-text').val().trim();
        if (query) {
            window.location.href = `exibicao_filmes.html?resultados=${encodeURIComponent(query)}`;
        }
    });

});

