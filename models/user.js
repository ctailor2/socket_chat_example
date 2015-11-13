'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    socket_identifier: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
