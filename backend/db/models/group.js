'use strict';
const {  Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static associate(models) {
      Group.belongsToMany(models.User, {
        through: 'Member',
        foreignKey: 'groupId',
        otherKey: 'userId'
      });

      Group.belongsToMany(models.Venue, {
        through: 'Event',
        foreignKey: 'groupId',
        otherKey: 'venueId'
      });

      Group.hasMany(models.Venue, { foreignKey: 'groupId' });

      Group.belongsTo(models.User, { foreignKey: 'organizerId' });

      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required'
        },
        len: {
          args: [1, 60],
          msg: 'Name must be between 1 and 60 charecters'
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'About is required'
        },
        len: {
          args: [50, 9999],
          msg: 'About must be 50 charecters or more'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type is required"
        },
        isOnlineOrInPerson(value) {
          if(value !== 'Online' && value !== 'In person') {
            throw new Error("Type must be 'Online' or 'In person'")
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Private is required'
        },
        isIn: {
          args: [[true, false, 0, 1]],
          msg: 'Private must be a boolean'
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
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
