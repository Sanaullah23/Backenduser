const express =require('express');
const { createTestUser, getTestUser } = require('../controllers/testUserController');
const router = express.Router();


router.post('/createtestuser', createTestUser)
router.post('/gettestuser', getTestUser)


module.exports=router