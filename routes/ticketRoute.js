const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {  saveTicket, getTickets, getTicketById, getAllTickets, replyToTicket, closeTicket } = require('../controllers/ticketController')

router.post('/create-ticket', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), saveTicket);
router.post('/create-contact-ticket', saveTicket);
router.get('/get-tickets', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTickets);

router.get('/get-ticket/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.USER), getTicketById);

router.put('/:id/reply', verifyUserToken, verifyUserRoles(ROLES_LIST.USER, ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), replyToTicket);

router.put('/:id/close', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.USER), closeTicket);
router.get('/get-all-tickets', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), getAllTickets);

module.exports = router