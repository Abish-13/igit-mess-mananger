const express = require('express');
const router = express.Router();
const { 
    registerAdmin, 
    registerStudent, 
    login, 
    getHostels,
    getUser,
    deleteUser,
    getStudents
} = require('../controllers/authController');

// Routes
router.post('/register-admin', registerAdmin);
router.post('/register-student', registerStudent);
router.post('/login', login);
router.get('/hostels', getHostels); // Public route to populate dropdown
router.get('/user/:id', getUser);
router.delete('/user/:id', deleteUser);
router.get('/students/:hostelId', getStudents);

module.exports = router;