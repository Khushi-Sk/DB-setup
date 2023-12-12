'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follow.init({
    id:{
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false
    },
    followedAt:{
      type: DataTypes.DATE,
      allowNull:false
    } ,
    followerId:{
      type: DataTypes.BIGINT,
      allowNull:false,
      references:{
        model: "Users",
        key: "id"
      }
    },
    followingId:{
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: "Users",
        key: "id"
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};