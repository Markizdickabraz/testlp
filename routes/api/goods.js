const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
// const {validateBody, isValidId, authorization} = require('../../middlewares')
// const { schemas } = require('../../models/contact');
const {isValidId} = require('../../middlewares');

router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

module.exports = router;