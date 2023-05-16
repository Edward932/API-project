const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', require('./session'));
router.use('/users', require('./users.js'));
router.use('/groups', require('./groups.js'));
router.use('/venues', require('./venues.js'));
router.use('/events', require('./events.js'));

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
