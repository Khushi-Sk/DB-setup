'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Follows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      followedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      followerId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references:{
          model: "Users",
          key: "id"
        }
      },
      followingId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references:{
          model: "Users",
          key: "id"
        }
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
    await queryInterface.dropTable('Follows');
  }
};