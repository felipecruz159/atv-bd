import express from 'express'

const app = express()
const port = 4000

import rotasJogadores from './routes/jogador.js'
import rotasUsuarios from './routes/usuario.js'
// app.routes(express.urlencoded({ extended: true}))
app.use(express.json())
app.use('/', express.static('public'))

app.use('/api/jogadores', rotasJogadores)
app.use('/api/usuarios', rotasUsuarios)

app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API Funcional',
        version: '1.0.1'
    })
})
app.use('/favicon.ico', express.static('public/images/computer.png'))

app.use(function (req, res) {
    res.status(404).json({
        errors: [{
            value: `${req.originalUrl}`,
            msg: `A rota ${req.originalUrl} não existe nesta API!`,
            param: 'invalid route'
        }]
    })
})

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`)
})