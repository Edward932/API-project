'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event } = require('../models');

const seed = [
  {
    event: 'Tennis Group First Meet and Greet',
    imgs: [
      {
        url: 'https://fake.url.com',
        preview: false
      },
      {
        url: 'https://fake2.url.com',
        preview: true
      }
    ]
  },
  {
    event: 'new Event 2',
    imgs: [
      {
        url: 'https://fake4.url.com',
        preview: true
      },
      {
        url: 'https://fake3.url.com',
        preview: false
      },
      {
        url: 'https://fake5.url.com',
        preview: false
      }
    ]
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

      const imgsArr = seed[i].imgs;
      for(let j = 0; j < imgsArr.length; j++) {
        await event.createEventImage(imgsArr[j]);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options);
  }
};
