const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/goods');
const { validateBody, isValidId, authorization } = require('../../middlewares');
const {addSchema} = require('../../models/goods');

router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

router.post('/', authorization, validateBody(addSchema), ctrl.addGood);

module.exports = router;