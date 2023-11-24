import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'usuarios'

//JWT
import auth from '../middleware/auth.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Validações
const validaUsuario = [
    check('nome')
        .not().isEmpty().trim().withMessage('É obrigatório informar o nome')
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('Informe apenas texto no nome')
        .isLength({ min: 3 }).withMessage('O nome do usuário deve ter ao menos 3 caracteres')
        .isLength({ max: 100 }).withMessage('O nome do usuário deve ter no máximo 100 caracteres'),
    check('email')
        .not().isEmpty().trim().withMessage('O email é obrigatório')
        .isLowercase().withMessage('O email não pode conter MAIÚSCULOS')
        .isEmail().withMessage('O email deve ser válido')
        .custom((value, { req }) => {
            return db.collection(nomeCollection).find({ email: { $eq: value } }).toArray().then((email) => {
                if (email.length && !req.params.id) {
                    return Promise.reject(`O email ${value} já existe!`)
                }
            })
        }),
    check('senha')
        .not().isEmpty().trim().withMessage('A senha é obrigatória')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1, minUppercase: 1,
            minSymbols: 1, minNumbers: 1
        }).withMessage('A senha informada não é segura. Informe no mínimo 1 caractere maiúsculo, 1 caractere minúsculo, 1 número e 1 caractere especial'),
    check('ativo')
        .default(true)
        .isBoolean().withMessage('O valor deve ser um booleano. True ou False')
]

// Post usuário
router.post('/', validaUsuario, async (req, res) => {
    const schemaErrors = validationResult(req)
    if (!schemaErrors.isEmpty()) {
        return res.status(403).json(({
            errors: schemaErrors.array()
        }))
    } else {
        const salt = await bcrypt.genSalt(10)
        req.body.senha = await bcrypt.hash(req.body.senha, salt)
        await db.collection(nomeCollection)
            .insertOne(req.body)
            .then(result => res.status(201).send(result))
            .catch(err => res.status(400).json(err))
    }
})

/**
 * POST /usuarios/login
 */

const validaLogin = [
    check('email')
        .not().isEmpty().trim().withMessage('O email é obrigatório!')
        .isEmail().withMessage('Informe um email válido!'),
    check('senha')
        .not().isEmpty().trim().withMessage('A senha é obrigatória!')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
]

router.post('/login', validaLogin, async (req, res) => {
    const schemaErrors = validationResult(req)
    if (!schemaErrors.isEmpty()) {
        return res.status(403).json(({ errors: schemaErrors.array() }))
    }

    const { email, senha } = req.body
    try {
        let usuario = await db.collection(nomeCollection).find({ email }).limit(1).toArray()

        if (!usuario.length)
            return res.status(404).json({
                errors: [{
                    value: `${email}`,
                    msg: 'O email informado não está cadastrado',
                    param: 'email'
                }]
            })

        const isMatch = await bcrypt.compare(senha, usuario[0].senha)
        if (!isMatch)
            return res.status(403).json({
                errors: [{
                    value: `senha`,
                    msg: 'A senha informada está incorreta',
                    param: 'senha'
                }]
            })
        jwt.sign(
            { usuario: { id: usuario[0]._id } },
            process.env.SECRET_KEY,
            { expiresIn: process.env.EXPIRES_IN },
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    access_token: token
                })
            }
        )
    } catch (e) {
        console.error(e)
    }
})

/**
 * GET /usuarios
 */
router.get('/', auth, async (req, res) => {
    try {
        db.collection(nomeCollection)
            .find({}, { projection: { senha: false } })
            .sort({ nome: 1 })
            .toArray((err, docs) => {
                if (!err) { res.status(200).json(docs) }
            })
    } catch (err) {
        res.status(500).json({
            errors:
                [{ msg: 'Erro ao obter a listagem de usuários' }]
        })
    }
})

/**
 * DELETE /usuarios/id
 */
router.delete('/:id', auth, async (req, res) => {
    await db.collection(nomeCollection)
        .deleteOne({ '_id': { $eq: ObjectId(req.params.id) } })
        .then(result => res.status(202).send(result))
        .catch(err => res.status(400).json(err))
})

/**
 * PUT /usuarios/id
 */
router.put('/:id', auth, validaUsuario, async (req, res) => {
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
