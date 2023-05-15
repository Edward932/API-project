'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const { Group, Venue, Event } = require('../models');

const seed = [
  {
    group: "Evening Tennis on the Water",
    venue: "123 Disney Lane",
    event: {
      name: "Tennis Group First Meet and Greet",
      type: "Online",
      capacity: 10,
      price: 18.50,
      description: "The first meet and greet for our group! Come say hello!",
      startDate: "2023-11-19 20:00:00",
      endDate: "2023-11-19 22:00:00",
    }
  },
  {
    group: "Evening Tennis on the Water",
    venue: "123 Disney Lane",
    event: {
      name: "new Event",
      type: "In person",
      capacity: 10,
      price: 18.50,
      description: "The first meet and greet for our group! Come say hello!",
      startDate: "2023-11-19 20:00:00",
      endDate: "2023-11-19 22:00:00",
    }
  },
  {
    group: "Fake group num 2",
    venue: "123 app academy Lane",
    event: {
      name: "new Event 2",
      type: "In person",
      capacity: 10,
      price: 18.50,
      description: "The first meet and greet for our group! Come say hello!",
      startDate: "2024-11-19 20:00:00",
      endDate: "2024-11-19 22:00:00",
    }
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {

    for(let i = 0; i < seed.length; i++) {
      const group = await Group.findOne({
        where: {
          name: seed[i].group
        }
      });
      const venue = await Venue.findOne({
        where: {
          address: seed[i].venue
        }
      });

      await Event.create({
        ...seed[i].event,
        groupId: group.id,
        venueId: venue.id
      });

    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.bulkDelete(options)
  }
};
