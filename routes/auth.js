/*
    path: /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post('/new', [
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    fieldValidators
], createUser);

router.post('/', [
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    fieldValidators
], loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;