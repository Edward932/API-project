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



module.exports = router;
