const express = require('express');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { isOrganizer, isOrganizerOrCohost } = require('../../utils/checkMembership');
const { Group, Member, GroupImage, User, Venue, Event, Attendee, EventImage } = require('../../db/models');

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

        groups[i].previewImage = previewImage?.url ?? 'No preview image for group'
    }

    res.json({ Groups: groups });
});

// get groups joined or organized by current user -- auth required
router.get('/current', requireAuth, async(req, res) => {

    const groups1 = await Group.findAll({
        include: {
            model: User,
            attributes: [],
            where: {
                id: req.user.id
            }
        }
    });
    const groups2 = await Group.findAll({
        where: { organizerId: req.user.id }
    });

    const groups = [];
    const used = new Set();
    groups1.forEach(currGroup => {
        currGroup = currGroup.toJSON();
        groups.push(currGroup);
        used.add(currGroup.id);
    });
    groups2.forEach(currGroup => {
        currGroup = currGroup.toJSON();
        if(!used.has(currGroup.id)) {
            groups.push(currGroup);
        }
    });

    for(let i = 0; i < groups.length; i++) {

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

// get group by id - no auth required
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

// add an imgage to a group. require auth = logged in a and organizer
router.post('/:groupId/images', requireAuth, isOrganizer, async(req, res, next) => {
    //check if user is organizer of group
    const group = await Group.findByPk(req.params.groupId);

    const { url, preview } = req.body;
    const img = await group.createGroupImage({ url, preview });

    res.json({
        id: img.id,
        url: img.url,
        preview: img.preview
    });
});

//edit a group  require auth = true and orgainzer
router.put('/:groupId', requireAuth, isOrganizer, async(req, res, next) => {
    // check if user is orginzer of group
    const group = await Group.findByPk(req.params.groupId);

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
router.delete('/:groupId', requireAuth, isOrganizer, async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    await group.destroy();

    res.json({
        message: 'Successfully deleted'
    });
});


// get all venue for a group   -- auth => oraganizer or co-host
router.get('/:groupId/venues', requireAuth, isOrganizerOrCohost, async(req, res, next) => {

    const venues = await Venue.findAll({
        where: {
            groupId: req.params.groupId
        }
    });

    res.json({ Venues: venues });
});

// create new venue by group id --> auth organizer or co-host
router.post('/:groupId/venues', requireAuth, isOrganizerOrCohost, async(req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    let venue;
    try{
        venue = await Venue.create({
            address,
            city,
            state,
            lat,
            lng,
            groupId: req.params.groupId
        });
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    venue = venue.toJSON();
    delete venue.createdAt;
    delete venue.updatedAt;
    res.json(venue);
});

// get all events of a group by group id  - no auth
// almost same code as get events in events.js so make a helper
router.get('/:groupId/events', async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        });
    };

    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        }
    });

    for(let i = 0; i < events.length; i++) {
        const currEvent = events[i].toJSON();
        console.log(currEvent)

        currEvent.numAttending = await Attendee.count({
            where: {
                eventId: currEvent.id
            }
        });

        const previewImage = await EventImage.findOne({
            where: {
                eventId: currEvent.id,
                preview: true
            }
        });

        currEvent.previewImage = previewImage?.url ?? 'No preview image for event'

        currEvent.Group = await Group.findByPk(currEvent.groupId, {
            attributes: ['id', 'name', 'city', 'state']
        });

        currEvent.venue = await Venue.findByPk(currEvent.venueId, {
            attributes: ['id', 'city', 'state']
        });

        events[i] = currEvent;
    }

    res.json({ Events: events });
});

//crate an event for a group --- auth orginazer or co-host
router.post('/:groupId/events', requireAuth, isOrganizerOrCohost, async(req, res, next) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    let event;
    try {
        const venue = await Venue.findByPk(venueId);

        event = await Event.create({
            groupId: parseInt(req.params.groupId),
            venueId: venue?.id ?? 'does not exist',
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    const payload = event.toJSON();
    delete payload.createdAt;
    delete payload.updatedAt;

    res.json(payload);
});


// get all members of a group by group id
// no auth required, but only show pendig members to organizer or co-host
router.get('/:groupId/members', restoreUser, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        });
    };


    let isOrgOrCohost = false;
    if(req.user) {
        const userId = req.user.toJSON().id
        if(userId == group.organizerId) {
            isOrgOrCohost = true;
        }
        const currUser = await Member.findOne({
            where: {
                groupId: group.id,
               userId: userId
            }
        })
        if(currUser?.status === 'co-host') {
            isOrgOrCohost = true;
        }
    }

    const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName']
    });

    for(let i = 0; i < users.length; i++) {
        const member = await Member.findOne({
            where: {
                groupId: group.id,
                userId: users[i].id
            }
        });

        const status =  member?.toJSON().status
        if(status) {
            users[i] = users[i].toJSON();
            users[i].Membership = { status }
        } else {
            users[i] = undefined
        }
    }

    let payload = users.filter(user => user);
    if(!isOrgOrCohost) {
        payload = payload.filter(user => user.Membership.status !== 'pending')
    }
    res.json({ Members: payload });
});

// request membership of group  require auth ==> logged in
router.post('/:groupId/membership', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        });
    };

    const userId = req.user.toJSON().id
    const membership = await Member.findOne({
        where: {
            groupId: group.id,
            userId: userId
        }
    });

    if(membership) {
        if(membership.status === 'pending') {
            res.status(400);
            return res.json({
                message: "Membership has already been requested"
            });
        } else {
            res.status(400);
            return res.json({
                message: "User is already a member of the group"
            });
        }
    }

    const newMembership = await Member.create({
        userId,
        groupId: group.id
    });

    await newMembership.reload();

    res.json({
        memberId: userId,
        status: newMembership.status
    });
});


//change the status of membership   require auth ==> pending to member org or cohost
// member to cohost must be or
router.put('/:groupId/membership', requireAuth, isOrganizerOrCohost, async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    const { memberId, status } = req.body;

    const user = await User.findByPk(memberId);
    if(!user) {
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = {
            memberId: "User couldn't be found"
        }
        return next(err);
    };

    const member = await Member.findOne({
        where: {
            userId: memberId,
            groupId: group.id
        }
    });

    if(!member) {
        res.status(404);
        return res.json({
            message: "Membership between the user and the group does not exist"
        });
    };

    if(status === 'co-host') {
        if(req.user.id !== group.organizerId) {
            res.status(403);
            return res.json({
                message: "Must be group orginizer to change status to co-host"
            });
        }
    }

    member.status = status;
    try{
        await member.save();
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    };

    await member.reload({
        attributes: ['id', 'groupId', 'userId', 'status']
    });

    res.json({
        id: member.id,
        goupId: member.groupId,
        memberId: member.userId,
        status: member.status
    });
});


// delete a membership to a group   require auth  must be host(organizer)
// or deleting own membership
router.delete('/:groupId/membership', requireAuth, async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if(!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        });
    };

    const { memberId } = req.body;

    const user = await User.findByPk(memberId);
    if(!user) {
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = {
            memberId: "User couldn't be found"
        }
        return next(err);
    };

    const member = await Member.findOne({
        where: {
            userId: memberId,
            groupId: group.id
        }
    });

    if(!member) {
        res.status(404);
        return res.json({
            message: "Membership between the user and the group does not exist"
        });
    };

    if(req.user.id === group.organizerId || req.user.id === parseInt(memberId)) {
        await member.destroy();
        res.json({
            message: 'Successfully deleted membership from group'
        });
    } else {
        const err = new Error('Forbiden');
        err.status = 403;
        next(err);
    }
});


module.exports = router;
