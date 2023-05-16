const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Venue, Group, Member } = require('../../db/models');

const router = express.Router();

// edit a venue by id  -- auth => orginizer or co-host
router.put('/:venueId', requireAuth, async(req, res, next) => {
    const venue = await Venue.findByPk(req.params.venueId);

    if(!venue) {
        res.status(404);
        return res.json({
         message: "Venue couldn't be found"
        });
    };

    const group = await Group.findByPk(venue.groupId);

    if(!group) {
        res.status(404);
        return res.json({
         message: "Group couldn't be found"
        });
    };

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

    const { address, city, state, lat, lng } = req.body;

    if(address) venue.address = address;
    if(city) venue.city = city;
    if(state) venue.state = state;
    if(lat) venue.lat = lat;
    if(lng) venue.lng = lng;

    try{
        await venue.save();
    } catch(e) {
        e.message = "Validation Error";
        e.status = 400;
        return next(e);
    };

    const payload = venue.toJSON();
    delete payload.updatedAt;
    res.json(payload);
});

module.exports = router;
