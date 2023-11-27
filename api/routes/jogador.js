import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'jogadores';

import auth from '../middleware/auth.js'

const validaJogador = [
    check('nick')
    .not().isEmpty().trim().withMessage('É obrigatório informar o nick'), 
    
]

/**
 * GET /api/jogador
 * Lista todos os jogadores 
 */
router.get('/', auth, async (req, res) => {
    try {
        db.collection(nomeCollection).find().sort({ nome: 1 }).toArray((err, docs) => {
            if (!err) {
                res.status(200).json(docs)
            }
        })
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem',
                param: '/'
            }]
        })
    }
})

/**
 * GET /api/jogadores/id/:id
 * Lista 
 */
router.get('/id/:id', auth, async (req, res) => {
    try {
        db.collection(nomeCollection).find({ '_id': { $eq: ObjectId(req.params.id) } })
            .toArray((err, docs) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json(docs)
                }
            })
    } catch (err) {
        res.status(500).json({ "error": err.message })
    }
})

/**
 * GET /api/jogadores/nome/:id
 * Lista 
 */
router.get('/nome/:nome', auth, async (req, res) => {
    try {
        db.collection(nomeCollection).find({ 'nome': { $regex: req.params.nome, $options: "i"}})
            .toArray((err, docs) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json(docs)
                }
            })
    } catch (err) {
        res.status(500).json({ "error": err.message })
    }
})

/**
 * GET /api/jogadores/nome/:id
 * Lista maiores de idade
 */
router.get('/maiores', auth, async (req, res) => {
    try {
        db.collection(nomeCollection).find({
            'idade': { $gte: 18, $lte: 40 } // Filtrar por idade maior ou igual a 18 anos e menor ou igual a 40 anos
        }).toArray((err, docs) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(docs);
            }
        });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

/**
 * DELETE /api/jogadores/:id
 * Apaga o jogador pelo id
 */
router.delete('/:id', auth, async (req, res) => {
    await db.collection(nomeCollection)
        .deleteOne({ "_id": { $eq: ObjectId(req.params.id) } })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
})

/**
 * POST /api/jogadores
 * Insere um novo jogador
 */

router.post('/', auth, validaJogador, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
            .insertOne(req.body)
            .then(result => res.status(200).send(result))
            .catch(err => res.status(400).json(err))
    }
})

/**
 * PUT /api/jogadores
 * Altera um jogador
 */

router.put('/', auth, validaJogador, async (req, res) => {
    let idDocumento = req.body._id
    delete req.body._id
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
            .updateOne({'_id': {$eq : ObjectId(idDocumento)}},
                        {$set: req.body})
            .then(result => res.status(200).send(result))
            .catch(err => res.status(400).json(err))
    }
})

/**
 * PUT /jogadores/id
 */
router.put('/:id', auth, validaJogador, async (req, res) => {
    const schemaErrors = validationResult(req)
    if (!schemaErrors.isEmpty()) {
        return res.status(403).json({
            errors: schemaErrors.array()
        })
    } else {
        await db.collection(nomeCollection)
            .updateOne({ '_id': { $eq: ObjectId(req.params.id) } },
                { $set: req.body }
            )
            .then(result => res.status(202).send(result))
            .catch(err => res.status(400).json(err))
    }
})
export default router