"use strict";

const express = require('express');
const router = express.Router();

const isAuthenticated = require('./middlewares/authentication').isAuthenticated;
const isAuthorized = require('./middlewares/authorization').isAuthorized;

const createNewUser = require('./routes/user/createNewUser').createNewUser;
const listAllUsers = require('./routes/user/listAllUsers').listAllUsers;
const getUserById = require('./routes/user/getUserById').getUserById;
const deleteUserById = require('./routes/user/deleteUserById').deleteUserById;
const updateUserById = require('./routes/user/updateUserById').updateUserById;
const listUsersNearby = require('./routes/user/listUsersNearby').listUsersNearby;

// POST	/users	Creates new user	Only admins and managers and users have access
router.post('/users',
    createNewUser
);

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

// GET	/users/:id	Gets the :id user	Admins, managers, user, and the same user as :id have access
router.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    getUserById
]);

// PATCH	/users/:id	Updates the :id user	Admins, managers, user, and the same user as :id have access
router.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    updateUserById
]);

// DELETE	/users/:id	Deletes the :id user	Admins, managers, user, and the same user as :id have access
router.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'], allowSameUser: true }),
    deleteUserById
]);

module.exports = router;
