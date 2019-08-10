const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/toyProblems', { useNewUrlParser: true, useFindAndModify: true });

const solutionSchema = new Schema({
  username: {
    type: String, required: true, index: false,
  },
  solution: {
    type: String, required: true, index: false,
  },
});

// This is hideous
// TODO: Split off to a different file
const CohortSchema = new Schema({
  cohortPrefix: {
    type: String, unique: true, required: true, index: true,
  },
  lastPull: { type: Number, default: 0 },
  students: [new Schema({ name: String, githubHandle: String })],
  solvedSolutions: [new Schema({ problem: String, solutions: [solutionSchema] }),
  ],
}, { strict: false });

const CohortModel = mongoose.model('Cohort', CohortSchema);

// TODO: Move queries to another file?

// Cohort Queries
const getAllCohorts = () => CohortModel.find({}).select('cohortPrefix -_id');

const getCohort = cohort => CohortModel.findOne({ cohortPrefix: cohort });

const addCohort = cohort => CohortModel.create(
  {
    cohortPrefix: cohort, lastPull: 0, students: [],
  },
);

const removeCohort = cohort => CohortModel.findOneAndDelete({ cohortPrefix: cohort });

const updateCohortname = (oldName, newName) => CohortModel.findOneAndUpdate(
  { cohortPrefix: oldName },
  { cohortPrefix: newName },
);

// Student queries
const addStudent = (name, githubHandle, cohort) => {
  const student = { name, githubHandle };
  return CohortModel.findOneAndUpdate(
    { cohortPrefix: cohort },
    { $push: { students: student } },
  );
};

const removeStudent = (studentId, cohort) => CohortModel.findOneAndUpdate(
  { cohortPrefix: cohort },
  { $pull: { students: { _id: studentId } } },
);

const updateStudentInfo = (name, githubHandle, studentId, cohort) => CohortModel.findOneAndUpdate(
  { cohortPrefix: cohort, 'students._id': studentId },
  { $set: { 'students.$': { name, githubHandle } } },
);


const getAllStudents = cohort => (
  CohortModel.findOne({ cohortPrefix: cohort })
    .then(result => result.students)
);


// Problem Queries

// This mostly works. It will add multiple of the same user to the same problem
// I might need to filter this later
const addProblemSolution = (cohortPrefix, problem, username, solution) => (
  CohortModel.findOneAndUpdate(
    { cohortPrefix, 'solvedSolutions.problem': problem },
    { $push: { 'solvedSolutions.$.solutions': { username, solution } } },
  )
    .then((doc) => {
      if (!doc) {
        return CohortModel.findOneAndUpdate({ cohortPrefix },
          { $push: { solvedSolutions: { problem, solutions: [] } } })
          .then(() => CohortModel.findOneAndUpdate(
            { cohortPrefix, 'solvedSolutions.problem': problem },
            { $push: { 'solvedSolutions.$.solutions': { username, solution } } },
          ));
      }
      return doc;
    })
    .catch(err => console.log(err))
);

const getAllProblems = cohort => CohortModel.findOne({ cohortPrefix: cohort });

// Pull Request Queries
const getLastPullCompleted = cohort => CohortModel.findOne({ cohortPrefix: cohort })
  .then(doc => doc.lastPull);

const incrementPull = cohort => CohortModel.findOneAndUpdate(
  { cohortPrefix: cohort },
  { $inc: { lastPull: 1 } },
);

module.exports = {
  addStudent,
  removeStudent,
  updateStudentInfo,
  getAllStudents,
  getAllCohorts,
  addCohort,
  getCohort,
  removeCohort,
  updateCohortname,
  addProblemSolution,
  getAllProblems,
  getLastPullCompleted,
  incrementPull,
};
