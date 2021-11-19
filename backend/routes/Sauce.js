const express = require('express');
const router = express.Router();

const authorize = require('../middleware/authorize');
const multer = require('../middleware/multer');

const sauceCtrl = require('../controllers/Sauce');

router.get('/', authorize, sauceCtrl.getAllSauce);
router.post('/', authorize, multer, sauceCtrl.addSauce);
router.get('/:id', authorize, sauceCtrl.getOneSauce);
router.put('/:id', authorize, multer, sauceCtrl.modifySauce);
router.delete('/:id', authorize, sauceCtrl.deleteSauce);
router.post('/:id/like', authorize, sauceCtrl.likeSauce);

module.exports = router;