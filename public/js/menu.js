const urlBase = 'http://localhost:4000/api'

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

async function carregarDados() {
    try {
        const response = await fetch(`${urlBase}/jogadores`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoiNjU2MDdkZjkzODE5M2Y4ZTlhZGJjNDI1In0sImlhdCI6MTcwMDk0OTAwNywiZXhwIjoxNzAxMjA4MjA3fQ.UQsdNpiSe2FoNJ7KdGD_X0FX8MLELlNvXHUO9slKGKs'
            })
        })
            .then(response => response.json())

        const table = document.getElementById('tableJogadores');
        table.innerHTML = '';

        response.forEach(jogador => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
            <td>${jogador.nome}</td>
            <td>${jogador.nacionalidade}</td>
            <td>${jogador.nick}</td>
            <td>${jogador.time.nome}</td>
            <td>${jogador.time.regiao}</td>
            <td>${jogador.idade}</td>
            <td>
                <a class="edit" title="Edit" data-toggle="tooltip" onclick="Editar('${jogador._id}')"><i class="material-icons">&#xE254;</i></a>
                <a class="delete" title="Delete" data-toggle="tooltip" onclick="Deletar()"><i class="material-icons">&#xE872;</i></a>
            </td>`;
            table.appendChild(linha);
        });

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function Adicionar() {
    const modalAdicionar = new bootstrap.Modal(document.getElementById('modalRegister'))
    modalAdicionar.show()
}

async function Editar(teste) {
    const modal = document.getElementById('modalEditar')
    const nome = document.getElementById('editarNome')
    const nacionalidade = document.getElementById('editarNacionalidade')
    const nick = document.getElementById('editarNick')
    const time = document.getElementById('editarTime')
    const regiao = document.getElementById('editarRegiao')
    const idade = document.getElementById('editarIdade')

    const response = await fetch(`${urlBase}/jogadores/id/${teste}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoiNjU2MDdkZjkzODE5M2Y4ZTlhZGJjNDI1In0sImlhdCI6MTcwMDk0OTAwNywiZXhwIjoxNzAxMjA4MjA3fQ.UQsdNpiSe2FoNJ7KdGD_X0FX8MLELlNvXHUO9slKGKs'
        })
    })
        .then(response => response.json())
        .then(data => {
            
            console.log(data)
            console.log(data[0].nome)
            nome.value = data[0].nome

            modal.classList.remove('d-none')
        })
    // declarar modal e trocar variaveis





}

function Deletar() {
    const resultadoModal = new bootstrap.Modal(document.getElementById('modalMensagem'))
    document.getElementById('mensagem').innerHTML = `<span class="text-danger">Teste</span>`
    resultadoModal.show() //abre o Modal
}