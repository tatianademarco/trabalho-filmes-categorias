$(document).ready(function () {
    function initializeCarousel() {
        $('.carousel').slick({
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            dots: true,
            responsive: [
                {
                    breakpoint: 1300,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 1130,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 940,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }

    function loadFilms() {
        $.ajax({
            url: 'http://localhost:8080/filmes',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                const container = $('.carousel');
                container.slick('unslick'); // Destroi a instância anterior do carrossel
                container.html(''); // Limpa o contêiner

                response.forEach(filme => {
                    const col = document.createElement('div');
                    col.className = "filme";

                    const imagem = filme.imagem;
                    const titulo = filme.nome;
                    const data = filme.data_lancamento;

                    const content = `<a href="info_filme.html?id=${filme.id}">
                                        <img src="http://localhost:8080/filmes/uploads/${imagem}" alt="Poster do filme">
                                        <h5>${titulo}</h5>
                                        <p>${new Date(data).toLocaleDateString()}</p>
                                    </a>`;
                    col.innerHTML = content;
                    container.append(col);
                });

                initializeCarousel(); // Re-inicializa o carrossel
            },
            error: function (error) {
                console.error('Erro ao buscar filmes', error);
            }
        });
    }

    initializeCarousel(); // Inicializa o carrossel quando a página é carregada pela primeira vez
    loadFilms(); // Carrega os filmes
});
