'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      // define association here
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Venues',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [[5, 100]],
          msg: 'Name must be at least 5 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isOnlineOrInPerson(value) {
          if(value !== 'Online' && value !== 'In person') {
            throw new Error('Type must be Online or In person')
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Capacity must be an integer'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Price is invalid'
        },
        min: {
          args: 0,
          msg: 'Price is invalid'
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date()
      }
    },
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
    validate: {
      endDateAfterStart() {
        if(new Date(this.startDate) > new Date(this.endDate)) {
          throw new Error('End date is less than start date')
        }
      }
    }
  });
  return Event;
};
