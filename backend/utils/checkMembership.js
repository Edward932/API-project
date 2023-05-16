// midle ware for validating if orginzer or if orginzer or co-host of a group
const { Group, Member } = require('../db/models');

const isOrganizer = async(_req, res, next) => {
    const group = await Group.findByPk(_req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

    if(_req.user.id !== group.organizerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    next();
};

const isOrganizerOrCohost = async(_req, res, next) => {
    const group = await Group.findByPk(_req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

    const membership = await Member.findOne({
        where: {
            userId: _req.user.id,
            groupId: group.id
        }
    });

    if(_req.user.id !== group.organizerId && membership?.status !== 'co-host') {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    next();
};

module.exports = { isOrganizer, isOrganizerOrCohost };
