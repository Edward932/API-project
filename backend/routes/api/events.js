const express = require('express');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');
const { Event, Attendee, EventImage, Group, Venue, Member, User } = require('../../db/models');

const router = express.Router();

// get all events    no auth required
router.get('/', async(req, res, next) => {
    const where = {};
    const { name, type, startDate } = req.query;
    if(name) where.name = { [Op.like]: `%${name}%` };
    if(type) where.type = type;
    if(startDate) where.startDate = {
        [Op.gt]: new Date(startDate)
    };

    const pagination = {};
    let { page, size } = req.query;

    page = page ?? 1;
    if(page > 10) page = 10;

    size = size ?? 20;
    if(size > 20) size = 20;
    if(size < 1) size = 1;

    const err = new Error('Bad Request');
    err.errors = {};
    let hasError = false;
    if(page < 1) {
        err.errors.page = "Page must be greater than or equal to 1";
        hasError = true;
    }
    if(size < 1) {
        err.errors.size = "Size must be greater than or equal to 1";
        hasError = true;
    }
    if(name && !isNaN(parseInt(name))) {
        err.errors.name = "Name must be a string";
        hasError = true;
    }
    if(type && type !== 'Online' && type !== 'In person') {
        err.errors.type = "Type must be 'Online' or 'In person'";
        hasError = true;
    }

    if(startDate && isNaN(Date.parse(startDate))) {
        err.errors.startDate = "Start date must be a valid datetime";
        hasError = true;
    };

    if(hasError) {
        return next(err);
    }

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    const events = await Event.findAll({
        where,
        ...pagination,
        attributes: ['id', 'name', 'description']
    });

    for(let i = 0; i < events.length; i++) {
        const currEvent = events[i].toJSON();

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

//add an image to an event
router.post('/:eventId/images', requireAuth, async(req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const attende = await Attendee.findOne({
        where: {
            eventId: event.id,
            userId: req.user.id
        }
    });

    const group = await Group.findByPk(event.groupId);


    if((attende && attende.status !== 'pending') || req.user.id === group.organizerId) {
        const { url, preview } = req.body;
        const img = await EventImage.create({ url, preview, eventId: event.id });

        res.json({
            id: img.id,
            url: img.url,
            preview: img.preview
        });
    } else {
        const err = new Error('Forbiden');
        err.status = 403;
        return next(err);
    }
});

// get details of event by id  -- no auth
router.get('/:eventId', async(req, res) => {
    const event = await Event.findOne({
         where: { id: req.params.eventId },
         attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'description',
            'type',
            'capacity',
            'price',
            'startDate',
            'endDate'
         ]
    });

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    }

    const payload = event.toJSON();
    payload.numAttending = await Attendee.count({
        where: {
            eventId: event.id
        }
    });
    payload.Group = await Group.findByPk(payload.groupId, {
        attributes: ['id', 'name', 'private', 'city', 'state']
    });
    payload.Venue = await Venue.findByPk(payload.venueId, {
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
    });
    payload.EventImages = await EventImage.findAll({
        where: {
            eventId: payload.id
        },
        attributes: ['id', 'url', 'preview']
    });

    res.json(payload);
});

// edit an event by id  auth req --- organizer or co-host
router.put('/:eventId', requireAuth, async(req, res, next) => {
    let event = await Event.findOne({
        where: { id: req.params.eventId },
        attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'capacity',
            'price',
            'description',
            'startDate',
            'endDate'
        ]
    });

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const group = await Group.findByPk(event.groupId);

    const membership = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    });

    if(req.user.id !== group.organizerId && membership?.status !== 'co-host') {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    const { venueId, name, type, capacity, price, description, startDate, endDate }= req.body;

    if(venueId) {
        const venue = await Venue.findByPk(venueId);
        if(!venue) {
            res.status(404);
            return res.json({
                message: "Venue couldn't be found"
            });
        }
        event.dataValues.venueId = venueId
    }
    if(name) event.name = name;
    if(type) event.type = type;
    if(capacity) event.capacity = capacity;
    if(price) event.price = price;
    if(description) event.description = description;
    if(startDate) event.startDate = startDate;
    if(endDate) event.endDate = endDate;

    try {
        await event.save()
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    const payload = event.toJSON();
    delete payload.updatedAt;

    res.json(payload);
});

// delet and event specified by id   auth require => orginizer or co-host
router.delete('/:eventId', requireAuth, async(req, res, next) => {
    let event = await Event.findOne({ where: { id: req.params.eventId }});

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const group = await Group.findByPk(event.groupId);

    const membership = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    });

    if(req.user.id !== group.organizerId && membership?.status !== 'co-host') {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    await event.destroy();

    res.json({
        message: "Successfully deleted"
    });
});

// get all attendes of an event
router.get('/:eventId/attendees', restoreUser, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId);

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const group = await Group.findByPk(event.groupId);
    let cohost = false;
    if(req.user?.id) {
        cohost = await Member.findOne({
            where: {
                userId: req.user.id,
                groupId: group.id,
                status: 'co-host'
            }
        });
    }

    const where = {
        eventId: event.id
    };
    if(req.user?.id !== group.organizerId && !cohost) {
        where.status = {
            [Op.not]: 'pending'
        }
    }

    const attendees = await Attendee.findAll({
         where
    });

    for(let i = 0; i < attendees.length; i++) {
        const status = attendees[i].status;
        attendees[i] = await User.findByPk(attendees[i].userId);
        attendees[i] = attendees[i].toJSON();
        attendees[i].Attendance = { status };
    }

    res.json({ Attendees: attendees });
});

// request to attend event  -- require auth member of group
router.post('/:eventId/attendance', requireAuth, async(req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const membership = await Member.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    });

    if(!membership) {
        const err = new Error('Forbiden');
        err.status = 403;
        return next(err);
    }

    const attendence = await Attendee.findOne({
        where: {
            userId: req.user.id,
            eventId: event.id
        }
    });

    if(attendence) {
        res.status(400);
        const message = attendence.status === 'pending' ?
            "Attendance has already been requested" :
            "User is already an attendee of the event";
        return res.json({ message });
    }


    const newAttendence = await Attendee.create({
        userId: req.user.id,
        eventId: event.id
    });

    res.json({
        userId: newAttendence.userId,
        status: newAttendence.status
    });
});

// change the status of and attendance   require auth ==> orginizer or co host
router.put('/:eventId/attendance', requireAuth, async(req, res, next) => {
    let event = await Event.findOne({ where: { id: req.params.eventId }});

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const group = await Group.findByPk(event.groupId);

    const membership = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    });

    if(req.user.id !== group.organizerId && membership?.status !== 'co-host') {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    };

    const { userId, status } = req.body;

    let attendance = await Attendee.findOne({
        where: {
            userId,
            eventId: event.id
        }
    });

    if(!attendance) {
        res.status(404);
        return res.json({
            message: "Attendance between the user and the event does not exist"
        });
    };

    attendance.status = status;
    try {
        await attendance.save();
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    }

    const payload = await attendance.reload({
        attributes: ['id', 'eventId', 'userId', 'status']
    });

    res.json({
        id: payload.id,
        eventId: payload.eventId,
        userId: payload.userId,
        status: payload.status
    });
});

// delete an attendacne to an event
// auth orginizer of group or deleting own attendance
router.delete('/:eventId/attendance', requireAuth, async(req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);

    if(!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    };

    const group = await Group.findByPk(event.groupId);

    const { userId } = req.body;

    if(req.user.id !== group.organizerId && req.user.id != userId) {
        const err = new Error('Only the User or organizer may delete an Attendance');
        err.status = 403;
        return next(err);
    }

    let attendance = await Attendee.findOne({
        where: {
            userId,
            eventId: event.id
        }
    });

    if(!attendance) {
        res.status(404);
        return res.json({
            message: "Attendance does not exist for this User"
        });
    };

    await attendance.destroy();

    res.json({
        message: "Successfully deleted attendance from event"
    });
});


module.exports = router;
