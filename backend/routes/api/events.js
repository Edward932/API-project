const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Event, Attendee, EventImage, Group, Venue, Member } = require('../../db/models');

const router = express.Router();

// get all events    no auth required
router.get('/', async(req, res) => {
    const events = await Event.findAll();

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

module.exports = router;
