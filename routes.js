"use strict";

const express = require('express');
const router = express.Router();

const config = require('./config');
const path = require('path');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, `/${config.directory.static}/${config.directory.resume}`))
    },
    filename: function (req, file, cb) {
        cb(null, req.body.uid + '.pdf')
    }
})
var upload = multer({ storage: storage })

const isAuthenticated = require('./middlewares/authentication').isAuthenticated;
const isAuthorized = require('./middlewares/authorization').isAuthorized;

const createNewUser = require('./routes/user/createNewUser').createNewUser;
const listAllUsers = require('./routes/user/listAllUsers').listAllUsers;
const getUserById = require('./routes/user/getUserById').getUserById;
const deleteUserById = require('./routes/user/deleteUserById').deleteUserById;
const updateUserById = require('./routes/user/updateUserById').updateUserById;
const listUsersNearby = require('./routes/user/listUsersNearby').listUsersNearby;
const uploadResume = require('./routes/user/uploadResume').uploadResume;
const downloadResume = require('./routes/user/downloadResume').downloadResume;

// POST	/users	Creates new user
router.post('/users',
    createNewUser
);

// GET	/users/nearby  Lists all nearby users  Only admins and managers and users have access
router.get('/users/nearby',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    listUsersNearby
);

// GET	/users	Lists all users	Only admins and managers and users have access
router.get('/users', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    listAllUsers
]);

// GET	/users/:id	Gets the :id user	Admins, managers and users, and the same user as :id have access
router.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    getUserById
]);

// PATCH	/users/:id	Updates the :id user  Admins, managers and users, and the same user as :id have access
router.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    updateUserById
]);

// DELETE	/users/:id	Deletes the :id user  Admins, managers and users, and the same user as :id have access
router.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    deleteUserById
]);

// POST	/users/resumes	Uploads resume of the :id user  Admins, managers and users, and the same user as :id have access
router.post('/users/resumes', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    upload.single('image'),
    uploadResume
]);

// GET	/users/resumes/:filename	Downloads resume of the :id user  Admins, managers and users, and the same user as :id have access
router.get('/users/resumes/:file', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    downloadResume
]);

module.exports = router;
