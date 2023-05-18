'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event, User, Attendee } = require('../models');

const seed = [
  {
    event: 'new Event 2',
    user: 'Demo-lition'
  },
  {
    event: 'new Event 2',
    user: 'FakeUser1'
  },
  {
    event: 'Tennis Group First Meet and Greet',
    user: 'FakeUser1',
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {

    for(let i = 0; i < seed.length; i++) {
      const event = await Event.findOne({
        attributes: ['id'],
        where: {
          name: seed[i].event
        }
      });

      const user = await User.findOne({
        where: {
          username: seed[i].user
        }
      });

      const status = seed[i].status;

      await Attendee.create({
        eventId: event.id,
        userId: user.id,
        status
      });
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendees'
    await queryInterface.bulkDelete(options);
  }
};
