'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex(
      'Members',
      ['groupId', 'userId'],
      {
        unique: true,
        name: 'idx_unique_Members_groupId_userId',
        ...options
      },
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Members', 'idx_unique_Members_groupId_userId', options);
  }
};
