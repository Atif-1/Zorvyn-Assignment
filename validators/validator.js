const { body, param,query } = require('express-validator');

const createUserValidators = [
    body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
];

const getUserValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim().escape(),
  query('type').optional().isIn(['income', 'expense'])
];

const createTransactionValidator=[
    body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be either "income" or "expense"'),
]

module.exports = { createUserValidators,getUserValidator,createTransactionValidator};
