const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { GroupImage, Group, Member } = require('../../db/models');

const router = express.Router();

// delete image for a group  require auth => orginizer or cohost
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const groupImage = await GroupImage.findByPk(req.params.imageId);

    if(!groupImage) {
        res.status(404);
        return res.json({
            message: "Group Image couldn't be found"
        });
    };

    const group = await Group.findByPk(groupImage.groupId);
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

    await groupImage.destroy();

    res.json({
        message: "Successfully deleted"
    });
});




module.exports = router;
