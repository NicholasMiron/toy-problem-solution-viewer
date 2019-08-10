const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/toyProblems', { useNewUrlParser: true, useFindAndModify: true });

const solutionSchema = {
  username: {
    type: String, unique: true, required: true,
  },
  solutin: {
    type: String, unique: true, required: true,
  },
};

// This is hideous
// TODO: Split off to a different file
const CohortSchema = new Schema({
  cohortPrefix: {
    type: String, unique: true, required: true,
  },
  lastPull: Number,
  students: [new Schema({ name: String, githubHandle: String })],
  solvedSolutions: {
    allAnagrams: [],
    asyncMap: [],
    balancedParens: [],
    binarySearchArray: [],
    bubbleSort: [],
    characterFrequency: [],
    coinSums: [],
    commonAncestor: [],
    commonCharacters: [],
    composePipe: [],
    constantTimeStackMin: [],
    deepEquality: [],
    doublyLinkedList: [],
    editDistance: [],
    emailRegex: [],
    evenOccurrence: [],
    fractionConverter: [],
    functionBind: [],
    hashTable: [],
    hashTableResizing: [],
    insertionSort: [],
    integerGenerator: [],
    integerReverse: [],
    islandCount: [],
    isSubsetOf: [],
    largestProductOfThree: [],
    linkedList: [],
    linkedListCycles: [],
    linkedListIntersection: [],
    longestPalindrome: [],
    longestRun: [],
    lruCache: [],
    mergeSort: [],
    missingNumber: [],
    nonrepeatedCharacter: [],
    nthFibonacci: [],
    numberToEnglish: [],
    powerSet: [],
    primeTester: [],
    queueStack: [],
    quicksort: [],
    rangeClass: [],
    rockPaperScissors: [],
    romanNumeralTranslator: [],
    rotateMatrix: [],
    shuffleDeck: [],
    sudokuChecker: [],
    sumArray: [],
    telephoneWords: [],
    tree: [],
    treeBFSelect: [],
    treeCountLeaves: [],
    treeDFSelect: [],
  },
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
// const addProblemSolution = (cohort, problem, username, solution) => {
//   console.log(cohort, username, problem, solution);
//   return CohortModel.findOne({ cohortPrefix: cohort })
//     .then((cohortDoc) => {
//       cohortDoc.solvedSolutions[problem] = cohortDoc.solvedSolutions[problem] || {};
//       cohortDoc.solvedSolutions[problem][username] = solution;

//       console.log(cohortDoc);
//       return cohortDoc.save();
//     })
//     .catch((err) => {
//       console.log('Save solved solutin ERROR', err);
//     });
// };

const addProblemSolution = (cohort, problem, username, solution) => {
  console.log(cohort, username, problem);

  // return CohortModel.findOne({ cohortPrefix: cohort })
  //   .then((doc) => {
  //     doc.solvedSolutions = doc.solvedSolutions || {};
  //     doc.solvedSolutions[problem] = doc.solvedSolutions[problem] || {};
  //     doc.solvedSolutions[problem][username] = solution;
  //     console.log(doc);
  //     return doc.save();
  //   });
  const solvedSolutions = {};
  solvedSolutions[problem] = {};
  solvedSolutions[problem][username] = solution;

  return CohortModel.findOne(
    { cohortPrefix: cohort, solvedSolutions: problem },
  ).then(console.log);
};

// const addProblemSolution = (cohortPrefix, problem, username, solution) => (
//   CohortModel.findOne({ cohortPrefix })
//     .then((doc) => {
//       if (!doc.solvedSolutions[problem]) doc.set({});
//       doc.solvedSolutions[problem] = doc.solvedSolutions[problem] || {};
//       doc.solvedSolutions[problem][username] = doc.solvedSolutions[problem][username];
//       doc.save();
//     })
// );

const getLastPullCompleted = cohort => CohortModel.findOne({ cohortPrefix: cohort })
  .then(doc => doc.lastPull);

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
  // getProblemSolutions,
  getLastPullCompleted,
};
