'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Group, Venue } = require('../models');

const seed = [
  {
    group: 'Evening Tennis on the Water',
    venues: [
      {
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327,
      },
      {
        "address": "new venue",
        "city": "New York",
        "state": "NY",
        "lat": 23.7645358,
        "lng": 2.4730327,
      }
    ]
  },
  {
    group: "Fake group num 2",
    venues: [
      {
        "address": "123 app academy Lane",
        "city": "New York",
        "state": "CA",
        "lat": -30.7645358,
        "lng": 122.4730327,
      }
    ]
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

      const venuesArr = seed[i].venues;
      for(let j = 0; j < venuesArr.length; j++) {
        await Venue.create({ ...venuesArr[j], groupId: group.id });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues'
    await queryInterface.bulkDelete(options)
  }
};
