'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const { Group, Venue, Event } = require('../models');

const seed = [
  {
    group: "App Academy",
    venue: "123 Disney Lane",
    event: {
      name: "Graduation - February Cohort",
      type: "Online",
      capacity: 40,
      price: 18.50,
      description: "We made it !",
      startDate: "2023-8-1 20:00:00",
      endDate: "2023-8-1 22:00:00",
    }
  },
  {
    group: "Leetcode",
    venue: "123 Disney Lane",
    event: {
      name: "Weekly contest",
      type: "Online",
      capacity: 1000,
      price: 0,
      description: "Weekly coding contest. First prize is an Apple HomePod mini!!!",
      startDate: "2023-6-19 20:00:00",
      endDate: "2023-6-19 22:00:00",
    }
  },
  {
    group: "Defeat chatGPT",
    venue: "123 app academy Lane",
    event: {
      name: "Figure out how to defaut chatGPT",
      type: "In person",
      capacity: 10,
      price: 0,
      description: "We will make a plan to defeat chatGPT.",
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
