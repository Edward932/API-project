'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {

    static associate(models) {
      Venue.belongsToMany(models.Group, {
        through: 'Event',
        foreignKey: 'venueId',
        otherKey: 'groupId'
      });

      Venue.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required'
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Latitude is not valid'
        },
        isNumeric: {
          args: [true],
          msg: 'Latitude is not valid'
        },
        min: {
          args: [-90],
          msg: 'Latitude is not valid'
        },
        max: {
          args: [90],
          msg: 'Latitude is not valid'
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Longitude is not valid'
        },
        isNumeric: {
          args: [true],
          msg: 'Longitude is not valid'
        },
        min: {
          args: [-180],
          msg: 'Longitude is not valid'
        },
        max: {
          args: [180],
          msg: 'Longitude is not valid'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Venue;
};
