'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Group, User, Member } = require('../models');

const seed = [
  {
    group: "Evening Tennis on the Water",
    users: [
      'Demo-lition',
      'FakeUser1'
    ]
  },
  {
    group:  "Fake group num 2",
    users: [
      'FakeUser2',
      'FakeUser1'
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

      const usersArr = seed[i].users;
      for(let j = 0; j < usersArr.length; j++) {
        const user = await User.findOne({
          where: {
            username: usersArr[j]
          }
        });

        await Member.create({ groupId: group.id, userId: user.id });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Members'
    await queryInterface.bulkDelete(options)
  }
};
