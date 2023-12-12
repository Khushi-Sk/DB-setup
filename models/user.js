'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id:{
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING(50),
      allowNull: false
    } ,
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING(200),
      allowNull: false
    } ,
    location: {
      type: DataTypes.STRING(50)
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING(1200),
      allowNull: false
    },
    coverPicture: {
      type: DataTypes.STRING(1200),
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};