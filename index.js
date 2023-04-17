const express = require('express');
const app = express();
const cors = require('cors')

//criando um Middleware - Momento de execução antes do carregamento da rota
app.use((req, res, next)=>{
    // permitindo que o endereço indicado pode acessar esta API
    //http://localhost:3000 é o endereço da aplicação REACT
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    // permitindo que os seguintes métodos poderam serem usados pela aplicação externa
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    // carregar o cors 
    app.use(cors())
    // continuar execução
    next()
})

//mongodb
const mongoose = require('mongoose');

// models
require('./models/Artigo')
const Artigo = mongoose.model('artigo')

//conectando com banco de dados
mongoose.connect('mongodb://0.0.0.0:27017/conteudo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Conexão com banco de dados feita com sucesso')
}).catch((erro)=>{
    console.log('erro na conexão com banco de dados'+ erro)
})

// fazer o express permitir o uso de json
app.use(express.json());

//listando na API
app.get('/', (req, res)=>{
    const artigo = Artigo.find({})
    .then((artigos)=>{
        return res.json(artigos)
    }).catch((error)=>{
        return res.status(400).json({
            error: true,
            message: 'Error: erro na consulta do artigo no banco de dados ' + error
        })
    })
})

//visualizando apenas um regitro na API
app.get('/artigos/:id', (req, res)=>{
    const artigo = Artigo.findOne({_id: req.params.id})
    .then((artigo)=>{
        return res.json(artigo)
    }).catch((error)=>{
        return res.status(400).json({
            error: true,
            message: 'Error: erro na consulta do artigo no banco de dados ' + error
        })
    })
})

// editando registro
app.put('/artigos/:id', (req, res)=>{
    const artigos = Artigo.updateOne({_id: req.params.id}, req.body)
    .then((artigo)=>{
        return res.status(400).json({
            error: false,
            message: 'Artigo editado com sucesso',
        })
    }).catch((error)=>{
        return res.status(400).json({
            error: true,
            message: 'erro ao editar registro ' +error
        })
    })
})

app.delete('/artigo/:id', (req, res)=>{
    const artigo = Artigo.deleteOne({_id: req.params.id})
    .then(()=>{
        return res.status(200).json({
            error: false,
            message: 'Artigo deletado com sucesso'
        })
    }).catch((erro)=>{
        return res.status(400).json({
            error: true,
            message: 'erro ao artigo ser deletado '+erro
        })
    })
})

// cadastrando na API
app.post('/artigo', (req, res)=>{
    const artigo = Artigo.create(req.body)
    .then(()=>{
        return res.status(200).json({
            error: false,
            message: 'Artigo foi cadastrado com sucesso no banco de dados'
        })
    }).catch((error)=>{
        return res.status(400).json({
            error: true,
            message: 'Error: Artigo não foi cadastrado no banco de dados ' + error
        })
    })
})
app.listen(8080, ()=>{
    console.log('O servidor foi iniciado na porta 8080: http://localhost:8080')
})