'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sheetdata = sequelize.define('Sheetdata', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    key: DataTypes.STRING,
    data: DataTypes.JSON
  }, {});
  Sheetdata.associate = function(models) {
    // associations can be defined here
  };
  return Sheetdata;
};