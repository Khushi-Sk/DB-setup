'use strict';


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    id:{
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT
    },
    content: {
      type:  DataTypes.STRING(280),
      allowNull:false
    },
    userId:{
      type: DataTypes.BIGINT,
      allowNull:false,
      references:{
        model: "Users",
        key:"id"
      }
    } ,
    type: {
      type: DataTypes.ENUM,
      values: ["post", "repost", "comment"],
      defaultValue: "post",
      allowNull:false
  },
    postedAt: {
      type: DataTypes.DATE,
      allowNull:false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'Post',
  });
  return Post;
};