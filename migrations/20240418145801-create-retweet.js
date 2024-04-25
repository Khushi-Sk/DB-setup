'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Retweets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      postId: {
        type: Sequelize.BIGINT,
        references:{
          model: "Posts",
          key:"id"
        }
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id"
        }
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('Retweets');
  }
};