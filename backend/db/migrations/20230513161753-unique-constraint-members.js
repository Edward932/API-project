'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('Members',
      ['groupId', 'userId'],
      {
        unique: true,
        name: 'idx_unique_Members_groupId_userId'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Members', 'idx_unique_Members_groupId_userId');
  }
};
