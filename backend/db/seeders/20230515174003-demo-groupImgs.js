'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const { Group } = require('../models');

const seed = [
  {
    group: 'App Academy',
    imgs: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Appacademylogo.png/175px-Appacademylogo.png',
        preview: true
      }
    ]
  },
  {
    group: 'Leetcode',
    imgs: [
      {
        url: 'https://leetcode.com/static/images/LeetCode_Sharing.png',
        preview: true
      }
    ]
  },
  {
    group: 'MDN',
    imgs: [
      {
        url: 'https://download.logo.wine/logo/MDN_Web_Docs/MDN_Web_Docs-Logo.wine.png',
        preview: true
      }
    ]
  },
  {
    group: 'Defeat chatGPT',
    imgs: [
      {
        url: 'https://www.guidingtech.com/wp-content/uploads/ChatGPT-error.png',
        preview: true
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
