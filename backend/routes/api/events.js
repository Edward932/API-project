const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Event, Attendee, EventImage, Group, Venue } = require('../../db/models');

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


module.exports = router;
