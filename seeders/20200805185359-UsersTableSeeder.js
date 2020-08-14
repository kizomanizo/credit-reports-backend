const bcrypt = require('bcrypt');
'use strict';

const { uuid } = require('uuidv4');
const plainPassword = "DAUser123";
const saltRounds = 11;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: uuid(),
      username: "admin",
      password: bcrypt.hashSync("admin", salt),
      salt: salt,
      saltRounds: saltRounds,
      lastLogin: null,
      tokenExpiry: null,
      status: true,
      joinDate: '2010-01-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },
          
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};