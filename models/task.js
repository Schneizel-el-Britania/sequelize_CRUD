'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey:'userId'
      });//userId->user_id
    }
  }
  Task.init({
    body: {
      type:DataTypes.TEXT,
      allowNull: false,
      validate:{
        notNull:true,
        notEmpty:true
      }
    },
    isDone: {
      type:DataTypes.BOOLEAN,
      field: 'is_done',
      allowNull: false,
      defaultValue:false,
      validate:{
        notNull:true
      }
    },
    deadLine: {
      field: 'dead_line',
      type:DataTypes.DATE,
      validate: {
        isDate: true
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored:true
  });
  return Task;
};