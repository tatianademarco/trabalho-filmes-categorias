$(document).ready(function() {
    function normalizeYouTubeUrl(url) {
        let videoId = null;
        const urlObj = new URL(url);
    
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            if (urlObj.pathname === '/watch') {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.pathname.startsWith('/embed/')) {
                videoId = urlObj.pathname.split('/')[2];
            } else if (urlObj.pathname.startsWith('/v/')) {
                videoId = urlObj.pathname.split('/')[2];
            }
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.split('/')[1];
        }
    
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        } else {
            return null;
        }
    }
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {

        console.log(id);
        $.ajax({
            url: `http://localhost:8080/filmes/${id}`,
            type: 'GET',
            contentType: 'application/json',
            success: function(response) {

                const detalhesContainer = $('#container-filme');

                urlNormalizada = normalizeYouTubeUrl(response.trailerUrl);

                detalhesContainer.html(`
                    <div id="info_filme">
                        <img src="http://localhost:8080/filmes/uploads/${response.imagem}" alt="Poster do filme">
                        <div class="text-movie">
                            <h3 class="title-movie">${response.nome}</h3>
                            <div class="infos">
                                <p>${new Date(response.data_lancamento).toLocaleDateString()}</p>
                                <p>${response.pais_origem}</p>
                                <p>${response.duracao_minutos} min</p>
                                <p id="classificacao-indicativa">${response.classificacao_indicativa}</p>
                            </div>
                            <p class="description">${response.descricao}</p>
                            <ul id="categorias">
                            </ul>
                        </div>
                        <div class="icones">
                            <img src="/assets/icons8-excluir.svg" alt="ícone de excluir" onmouseover="Tip('Excluir Filme')" onmouseout="UnTip()" id="excluir-filme">
                            <a href="cadastro_filme.html?id=${response.id}"> <img src="/assets/icons8-editar.svg" alt="ícone de editar" onmouseover="Tip('Editar Filme')" onmouseout="UnTip()" id="editar-filme"></a>
                        </div>
                    </div>
                    <h3>Trailer</h3>
                    <iframe width="560" height="315" src="${urlNormalizada}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    `);

                    if (response.classificacao_indicativa === 'L'){
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "green";
                    } else if (response.classificacao_indicativa === '10'){
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "blue";
                    } else if (response.classificacao_indicativa === '12') {
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "yellow";
                        document.getElementById('classificacao-indicativa').style.color = "black";
                    } else if (response.classificacao_indicativa === '14') {
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "orange";
                    } else if (response.classificacao_indicativa === '16') {
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "red";
                    } else if (response.classificacao_indicativa === '18') {
                        document.getElementById('classificacao-indicativa').style.backgroundColor = "black";
                    }

                // Exibir categorias do filme
                const categoriasFilmes = response.categorias;

                categoriasFilmes.forEach(categoria => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    const ul = document.getElementById('categorias');
                    a.textContent = categoria.nome;
                    a.className = "categoria-link";
                    li.appendChild(a);
                    ul.appendChild(li);
                });
                document.getElementById('categorias').lastChild.style.border = 'none';
            },
            error: function(error) {
                console.error('Erro ao buscar detalhes do filme:', error);
            }
        });
    }

    $(document).on('click', '#excluir-filme', function() {

        if (confirm('Tem certeza que deseja excluir este filme?')) {
            $.ajax({
                url: `http://localhost:8080/filmes/${id}`,
                type: 'DELETE',
                success: function(response) {
                    alert('Filme excluído com sucesso.');
                    window.location.href = 'exibicao_filmes.html';
                },
                error: function(error) {
                    console.error('Erro ao excluir o filme:', error);
                    alert('Ocorreu um erro ao tentar excluir o filme.');
                }
            });
        }
    });
});
