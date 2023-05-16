const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { Group, Member, GroupImage, User, Venue } = require('../../db/models');

const router = express.Router();

// get all groups -- no auth
router.get('/', async(req, res, next) => {
    const groups = await Group.findAll();

    for(let i = 0; i < groups.length; i++) {
        groups[i] = groups[i].toJSON();

        groups[i].numMembers = await Member.count({
            where: {
                groupId: groups[i].id
            }
        });

        const previewImage = await GroupImage.findOne({
            where: {
                groupId: groups[i].id,
                preview: true
            }
        });

        groups[i].previewImage = previewImage?.url ?? 'No preview image for group for'
    }

    res.json({ Groups: groups });
});

// get groups joined or organized by current user -- auth required
router.get('/current', requireAuth, async(req, res) => {
    console.log(req.user.id);

    // problem is this where clause will only work when both member an organize not either or.
    const groups = await Group.findAll({
        where: {
            organizerId: req.user.id
        },
        include: {
            model: User,
            attributes: ['id'],
            where: {
                id: req.user.id
            }
        }
    });

    for(let i = 0; i < groups.length; i++) {
        groups[i] = groups[i].toJSON();

        groups[i].numMembers = await Member.count({
            where: {
                groupId: groups[i].id
            }
        });

        const previewImage = await GroupImage.findOne({
            where: {
                groupId: groups[i].id,
                preview: true
            }
        });

        groups[i].previewImage = previewImage?.url ?? 'No preview image for group for';
    };


    res.json({ Groups: groups });
});

router.get('/:groupId', async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
            }
        ]
    });

    if (!group) {
       res.status(404),
       res.json({
        message: "Group couldn't be found"
       })
    }

    const payload = group.toJSON()
    payload.numMembers = await Member.count({
        where: {
            groupId: group.id
        }
    });
    payload.Organizer = await User.findByPk(payload.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })

    res.json(payload);
});

// create a group --- require auth = true
router.post('/', requireAuth, async(req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    let group;
    try {
        group = await Group.create({
            organizerId: req.user.id,
            name,
            about,
            type,
            private,
            city,
            state
        });
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    res.json(group);
});

// add an imgage to a group. require auth = logged in a and member
router.post('/:groupId/images', requireAuth, async(req, res, next) => {
    //check if user is organizer of group
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

    if(req.user.id !== group.organizerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    const { url, preview } = req.body;
    const img = await group.createGroupImage({ url, preview });

    res.json({
        id: img.id,
        url: img.url,
        preview: img.preview
    });
});

//edit a group  require auth = true and orgainzerId
router.put('/:groupId', requireAuth, async(req, res, next) => {
    // check if user is orginzer of group
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

    if(req.user.id !== group.organizerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    const { name, about, type, private, city, state } = req.body;
    if(name) group.name = name;
    if(about) group.about = about;
    if(type) group.type = type;
    if(private !== undefined) group.private = private;
    if(city) group.city = city;
    if(state) group.state = state;

    try{
        await group.save();
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    res.json(group);
});

// delete group  require auth true and user must be organizer
router.delete('/:groupId', requireAuth, async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

    if(req.user.id !== group.organizerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    await group.destroy();

    res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
