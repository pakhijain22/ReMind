const Patient = require('../models/Patient');
const { success, error } = require('../utils/responseFormat');

// POST /patients — Create Patient
async function createPatient(req, res) {
  const { name, loginPin, preferredLanguage } = req.body;
  const patient = await Patient.create({ name, loginPin, preferredLanguage });
  return success(res, {
    id: patient._id.toString(),
    name: patient.name,
    loginPin: patient.loginPin,
    preferredLanguage: patient.preferredLanguage,
    createdAt: patient.createdAt,
  }, 201);
}

// POST /patients/login — Patient Login
async function loginPatient(req, res) {
  const { loginPin } = req.body;
  const patient = await Patient.findOne({ loginPin });
  if (!patient) return error(res, 'Incorrect PIN', 400);
  return success(res, {
    id: patient._id.toString(),
    name: patient.name,
    preferredLanguage: patient.preferredLanguage,
  });
}

// GET /patients/:id — Get Patient Profile
async function getPatient(req, res) {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return error(res, 'Patient not found', 404);
  return success(res, {
    id: patient._id.toString(),
    name: patient.name,
    preferredLanguage: patient.preferredLanguage,
    createdAt: patient.createdAt,
  });
}

module.exports = { createPatient, loginPatient, getPatient };
