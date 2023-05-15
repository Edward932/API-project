'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex(
      'Attendees',
      ['eventId', 'userId'],
      {
        unique: true,
        name: 'idx_unique_Attendees_eventId_userId',
        ...options
      },
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Attendees', 'idx_unique_Attendees_eventId_userId', options)
  }
};
