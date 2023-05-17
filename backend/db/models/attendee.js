'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {

    static associate(models) {
      // define association here
    }
  }
  Attendee.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        customValidate(newVal) {
          const currVal = this.status;
          if(currVal && newVal === 'pending') {
            throw new Error('Cannot change a membership status to pending');
          }
          if(newVal) {
            this.status = newVal
          } else {
            this.status = 'pending'
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendee',
  });
  return Attendee;
};
