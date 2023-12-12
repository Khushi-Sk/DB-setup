'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      content: {
        type: Sequelize.STRING(280),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ["post", "repost", "comment"],
        defaultValue: "post",
        allowNull:false
    },
      userId: {
        type: Sequelize.BIGINT,
        allowNull:false,
        references:{
          model: "Users",
          key:"id"
        }
      },
      postedAt: {
        type: Sequelize.DATE,
        allowNull:false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};