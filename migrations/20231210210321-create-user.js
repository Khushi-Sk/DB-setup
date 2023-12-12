'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      displayName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      passwordHash: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      bio: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(50)
      },
      website: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      profilePicture: {
        type: Sequelize.STRING(1200),
        allowNull: false
      },
      coverPicture: {
        type: Sequelize.STRING(1200),
        allowNull: true
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Users');
  }
};