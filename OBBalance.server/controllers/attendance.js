const Sheetdata = require('../models').Sheetdata;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    getCurrent(req, res) {
        return Sheetdata.findOne({ where: { key: { [Op.like]: 'attendance_current' }}})
                        .then((sheetdata) => res.status(200).send(sheetdata.data))
                        .catch((error) => res.status(400).send(error));
    },

    getOld(req, res) {
        return Sheetdata.findOne({ where: { key: { [Op.like]: 'attendance_old' }}})
                        .then((sheetdata) => res.status(200).send(sheetdata.data))
                        .catch((error) => res.status(400).send(error));
    },

    saveCurrent(attendance) {
        return Sheetdata.findOne({ where: { key: { [Op.like]: 'attendance_current'}}})
                        .then((obj) => {
                            if(obj) { // update
                                return obj.update({ data: attendance });
                            }
                            else { // insert
                                return Sheetdata.create({ key: 'attendance_current', data: attendance });
                            }
                        });
    },

    saveOld(attendance) {
        return Sheetdata.findOne({ where: { key: 'attendance_old'}})
                        .then((obj) => {
                            if(obj) { // update
                                return obj.update({ data: attendance });
                            }
                            else { // insert
                                return Sheetdata.create({ key: 'attendance_old', data: attendance });
                            }
                        });
    }
};