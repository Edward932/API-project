'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const { Group } = require('../models');

const seed = [
  {
    group: 'Fake group num 2',
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
    group: 'Evening Tennis on the Water',
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
      const group = await Group.findOne({
        where: {
          name: seed[i].group
        }
      });

      const imgsArr = seed[i].imgs;
      for(let j = 0; j < imgsArr.length; j++) {
        await group.createGroupImage(imgsArr[j]);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options);
  }
};
