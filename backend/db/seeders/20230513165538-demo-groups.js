'use strict';

const { Group, User } = require('../models');
console.log("HERE", Group, User);

const seed = [
  {
    user: 'Demo-lition',
    groups: [
      {
        name: "Evening Tennis on the Water",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In person",
        private: true,
        city: "New York",
        state: "NY",
      },
      {
        name: "Fake event",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "Online",
        private: false,
        city: "Raleigh",
        state: "NC",
      }
    ]
  },
  {
    user: null,
    groups: [
      {
        name: "Fake event num 2",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "Online",
        private: false,
        city: "Raleigh",
        state: "NC",
      }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for(let i = 0; i < seed.length; i++) {
      const currObj = seed[i];

      if(!currObj.user) {
        for(let j = 0; j < currObj.groups.length; j++) {
          await Group.create(currObj.groups[j]);
        }
      } else {
        const user = await User.findOne({
          where: {
            username: currObj.user
          }
        });

        for(let j = 0; j < currObj.groups.length; j++) {
          const group = await Group.create(currObj.groups[j]);
          group.organizerId = user.id;
          await group.save();
        }

      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups');
  }
};
