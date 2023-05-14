'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {

    static associate(models) {
      // define association here
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
      validate: {
        isNumeric: true,
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      validate: {
        isNumeric: true,
        min: -180,
        max: 180
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
