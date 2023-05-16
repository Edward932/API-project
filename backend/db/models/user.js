'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsToMany(models.Group, {
        through: 'Member',
        foreignKey: 'userId',
        otherKey: 'groupId'
      });

      User.belongsToMany(models.Event, {
        through: 'Attendee',
        foreignKey: 'userId',
        otherKey: 'eventId'
      });

      User.hasMany(models.Group, { foreignKey: 'organizerId' });
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
          notNull: {
            msg: 'User with that username already exists'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
          notNull: {
            msg: 'User with that email already exists'
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        }
      },
      firstName: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
