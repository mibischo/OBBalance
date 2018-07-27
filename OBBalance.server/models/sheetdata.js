'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sheetdata = sequelize.define('Sheetdata', {
    key: DataTypes.STRING,
    data: DataTypes.JSON
  }, {});
  Sheetdata.associate = function(models) {
    // associations can be defined here
  };
  return Sheetdata;
};