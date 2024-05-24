const express = require('express');
const {
    get_teaminfo,
    get_single_teaminfo,
} = require('../controllers/teaminfoController');

const router = express.Router();

router.get('/', get_teaminfo);
router.get('/:name', get_single_teaminfo)


module.exports = router;