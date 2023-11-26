const urlBase = 'http://localhost:4000/api'

// monitorando o submit do formulario
document.getElementById('registerForm').addEventListener('submit', function(event){
    event.preventDefault() //evita o recarregamento do form
    // obtendo os valores do form
    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    const resultadoModal = new bootstrap.Modal(document.getElementById('modalMensagem'))
    // criando o objeto para autenticar
    const dadosCadastro = {
        nome: nome,
        email: email,
        senha: senha
    }

    // efetuando o post para a API REST
    fetch(`${urlBase}/usuarios`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(response => response.json())
    .then(data => {
        // verifica se o token foi retornado
        if(data.errors){ //possui algum erro? 
            const errorMessages = data.errors.map(error => error.msg).join('<br>')
            // alert('Falha ao efetuar o login:\n'+errorMessages)
            document.getElementById('mensagem').innerHTML = `<span class="text-danger">${errorMessages}</span>`
            resultadoModal.show() //abre o Modal
        } else{
            document.getElementById('mensagem').innerHTML = `<span class="text-success">Cadastro realizado com sucesso!</span>`
            resultadoModal.show() //abre o Modal
            window.location.href = 'index.html?registered=true'
        }
    })
    .catch(error => {
        console.error(`Erro no cadastro: ${error}`)
    })
})