'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Attendee,
        foreignKey: 'eventId',
        otherKey: 'userId'
      });

      Event.hasMany(models.EventImage, { foreignKey: 'eventId' });
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
      references: {
        model: 'Venues',
        key: 'id'
      },
      validate: {
        checkCustomInput(value) {
          if(value === 'does not exist') {
            throw new Error('Venue does not exist')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 100],
          msg: 'Name must be at least 5 characters'
        },
        notNull: {
          msg: 'Name is required'
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
      allowNull: false,
      validate: {
        isOnlineOrInPerson(value) {
          if(value !== 'Online' && value !== 'In person') {
            throw new Error('Type must be Online or In person')
          }
        },
        notNull: {
          msg: 'Type is required'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Capacity must be an integer'
        },
        notNull: {
          msg: 'Capacity is required'
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
          args: [0],
          msg: 'Price is invalid'
        },
        notNull: {
          msg: 'Price is required'
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: [new Date().toDateString()],
          msg: 'Start date must be in the future'
        },
        notNull: {
          msg: 'Start date is required'
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'End date is required'
        },
        endDateIsAfterStart() {
          if(new Date(this.startDate) > new Date(this.endDate)) {
            throw new Error('End date is less than start date')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate']
    }
  });
  return Event;
};
