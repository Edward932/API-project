const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { EventImage, Event, Group, Member } = require('../../db/models');

const router = express.Router();

//delete an image for an event   require auth orginizer or cohost of
// the group the event belongs to
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const image = await EventImage.findByPk(req.params.imageId);

    if(!image) {
        res.status(404);
        return res.json({
            message: "Event Image couldn't be found"
        });
    };

    const event = await Event.findByPk(image.eventId);
    const group = await Group.findByPk(event.groupId);
    const member = await Member.findOne({
        where: {
            groupId: group.id,
            userId: req.user.id
        }
    });

    if(req.user.id !== group.organizerId && member?.status !== 'co-host') {
        const err = new Error('Forbiden');
        err.status = 403;
        return next(err);
    }

    await image.destroy();

    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router;
