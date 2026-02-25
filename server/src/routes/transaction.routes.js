const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, getSummary, updateTransaction, deleteTransaction } = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getTransactions);
router.get('/summary', getSummary);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
