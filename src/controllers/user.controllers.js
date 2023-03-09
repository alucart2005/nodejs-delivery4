const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAll = catchError(async(req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async(req, res) => {
  const { email, password, firstName, lastName, country, Image } = req.body;
  const encripted = await bcrypt.hash(password, 10);
  const result = await User.create({email, password: encripted, firstName, lastName, country, Image});
  return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if(!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async(req, res) => {
  const { id } = req.params;
  await User.destroy({ where: {id} });
  return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
  const { id } = req.params;
  const result = await User.update(
    req.body,
    { where: {id}, returning: true }
  );
  if(result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update
}