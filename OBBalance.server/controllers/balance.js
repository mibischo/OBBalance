const Sheetdata = require('../models').Sheetdata;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    getCurrent(req, res) {
        return Sheetdata.findOne({ where: { key: { [Op.eq]: 'balance_current' }}})
                        .then((sheetdata) => res.status(200).send(sheetdata.data))
                        .catch((error) => res.status(400).send(error));
    },

    getOld(req, res) {
        return Sheetdata.findOne({ where: { key: { [Op.eq]: 'balance_old' }}})
                        .then((sheetdata) => res.status(200).send(sheetdata.data))
                        .catch((error) => res.status(400).send(error));
    },

    saveCurrent(balance) {
        return Sheetdata.findOne({ where: { key: { [Op.eq]: 'balance_current'}}})
                        .then((obj) => {
                            if(obj) { // update
                                return obj.update({ data: balance });
                            }
                            else { // insert
                                return Sheetdata.create({ key: 'balance_current', data: balance });
                            }
                        });
    },

    saveOld(balance) {
        return Sheetdata.findOne({ where: { key: { [Op.eq]: 'balance_old'}}})
                        .then((obj) => {
                            if(obj) { // update
                                return obj.update({ data: balance });
                            }
                            else { // insert
                                return Sheetdata.create({ key: 'balance_old', data: balance });
                            }
                        });
    }
};