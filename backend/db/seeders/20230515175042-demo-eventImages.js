'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event } = require('../models');

const seed = [
  {
    event: 'Graduation - February Cohort',
    imgs: [
      {
        url: 'https://cdn.pixabay.com/photo/2017/06/22/02/16/computer-icon-2429310_1280.png',
        preview: true
      }
    ]
  },
  {
    event: 'Weekly contest',
    imgs: [
      {
        url: 'https://assets.leetcode.com/users/images/4670048d-f8c8-4558-b790-39af34744d5e_1652094058.5072029.png',
        preview: true
      }
    ]
  },
  {
    event: 'Figure out how to defaut chatGPT',
    imgs: [
      {
        url: 'https://cdn.pixabay.com/photo/2022/08/30/08/04/brain-7420599_1280.png',
        preview: true
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
