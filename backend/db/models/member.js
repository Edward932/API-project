'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Member.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
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
    modelName: 'Member',
  });
  return Member;
};
