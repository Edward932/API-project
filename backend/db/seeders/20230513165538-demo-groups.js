'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { User, Group } = require('../models');

const seed = [
  {
    user: 'Demo-lition',
    groups: [
      {
        name: "App Academy",
        about: "Change your career, change your life. Our software engineering bootcamps are designed to help people with little to no coding experience become good at computer and make lots of money.",
        type: "Online",
        private: true,
        city: "San Francisco",
        state: "CA",
      },
      {
        name: "Leetcode",
        about: "LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.",
        type: "Online",
        private: false,
        city: "Raleigh",
        state: "NC",
      }
    ]
  },
  {
    user: "John-smith",
    groups: [
      {
        name: "MDN",
        about: "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
        type: "Online",
        private: false,
        city: "New York",
        state: "NY",
      },
      {
        name: "Defeat chatGPT",
        about: "Instead of learning to use AI to help us code we will team up to defeat chatGPT so that it does not take our jobs.",
        type: "Online",
        private: false,
        city: "Denver",
        state: "CO"
      }
    ]
  }
];

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
    options.tableName = 'Groups'
    await queryInterface.bulkDelete(options);
  }
};
