'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sheetdata = sequelize.define('Sheetdata', {
    id: DataTypes.INTEGER,
    key: DataTypes.STRING,
    data: DataTypes.STRING
  }, {});
  Sheetdata.associate = function(models) {
    // associations can be defined here
  };
  return Sheetdata;
};