'use strict';
const {
    Model, Sequelize
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
    };
    User.init({
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        saltRounds: DataTypes.INTEGER,
        lastLogin: DataTypes.DATE,
        tokenExpiry: DataTypes.DATE,
        status: DataTypes.INTEGER,
        joinDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};