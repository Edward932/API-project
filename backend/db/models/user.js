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
            msg: 'Username cannot be null'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: {
            args: [true],
            msg: "Invalid email",
          },
          notNull: {
            msg: 'Email cannot be null'
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
          notNull: { msg: 'Password is required' }
        }
      },
      firstName: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          notNull: { msg: 'firstName is required'}
        }
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          notNull: { msg: 'lastName is required'}
        }
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
