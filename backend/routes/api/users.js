const express = require('express');
const bcrypt = require('bcryptjs');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// const validateSignup = [
//     check('email')
//         .exists({ checkFalsy: true })
//         .isEmail()
//         .withMessage('Please provide a valid email.'),
//     check('username')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 4 })
//         .withMessage('Please provide a username with at least 4 characters.'),
//     check('username')
//         .not()
//         .isEmail()
//         .withMessage('Username cannot be an email.'),
//     check('password')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 6 })
//         .withMessage('Password must be 6 characters or more.'),
//     handleValidationErrors
// ];

const router = express.Router();

// Sign up
router.post('/', async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    let hashedPassword;
    try{
        hashedPassword = bcrypt.hashSync(password);
    } catch(e) {
        hashedPassword = null;
    }
    let user;
    try{
        user = await User.create({ email, username, hashedPassword, firstName, lastName });
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

module.exports = router;
