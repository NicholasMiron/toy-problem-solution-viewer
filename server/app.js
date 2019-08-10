const express = require('express');

const db = require('../db/db');
const {
  getCode, getPulls, getComments, updateCohortProblems,
} = require('./githubHelpers');

const app = express();
app.use(express.json());
app.use(express.static('dist'));


// TODO: move routes to seperate file

app.use('/api/cohort/:cohort/solutions/:problem', (req, res) => {
  const { problem, cohort } = req.params;

  // Please dont try to understand this
  Promise.all(getCode(problem, cohort))
    .then(studentCodeUnfiltered => studentCodeUnfiltered.filter(item => !!item))
    .then((studentCode) => { // [name, handle, code]
      const pullsPromise = getPulls(studentCode, cohort);
      Promise.all(pullsPromise)
        .then(pullsURLs => Promise.all(getComments(pullsURLs, problem)))
        .catch(() => {})
        .then((comments) => {
          const passing = comments.map(item => (item.length ? item.reduce((acc, cur) => acc | cur) : item[0]));
          const combinedStudentPassing = [];
          for (let i = 0; i < studentCode.length; i += 1) {
            combinedStudentPassing.push([...studentCode[i], passing[i]]);
          }
          const finalStudents = combinedStudentPassing.filter(studentInfo => studentInfo[3] === 1);
          res.send(finalStudents);
        });
    });
});


// Get all cohorts
app.get('/api/cohorts', (req, res) => {
  db.getAllCohorts()
    .then((response) => {
      res.send(response);
    });
});

// Add cohort
app.post('/api/cohorts/:cohort/', (req, res, next) => {
  const { cohort } = req.params;

  if (!/^hr(atx|nyc|hrr|sf|phx|la|rpt)\d{1,3}$/gi.test(cohort)) {
    res.sendStatus(400);
    next();
  }

  db.getCohort(cohort)
    .then((result) => {
      if (result) { // If we find something break
        console.log(result);
        res.send(409);
        next();
      }
      return db.addCohort(cohort);
    })
    .catch(err => console.log(err))
    .then(() => db.getAllCohorts())
    .then(data => res.send(data))
    .catch(() => res.sendStatus(400));
});

// Remove cohort
app.delete('/api/cohorts/:cohort', (req, res) => {
  const { cohort } = req.params;

  db.removeCohort(cohort)
    .then(() => db.getAllCohorts())
    .then(result => res.send(result))
    .catch(() => res.sendStatus(400));
});


// Get all students from a cohort
app.get('/api/cohorts/:cohort/students', (req, res) => {
  const { cohort } = req.params;
  db.getAllStudents(cohort)
    .then((students) => {
      res.send(students);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

// Add a new student to the cohort
app.post('/api/cohorts/:cohort/students', (req, res) => {
  const { cohort } = req.params;
  const { name, githubHandle } = req.body;

  db.addStudent(name, githubHandle, cohort)
    .then(() => db.getAllStudents(cohort))
    .then(students => res.send(students))
    .catch(() => res.sendStatus(400));
});


// Updates student's name and github handle
app.patch('/api/cohorts/:cohort/students/:studentId', (req, res) => {
  const { cohort, studentId } = req.params;
  const { name, githubHandle } = req.body;

  db.updateStudentInfo(name, githubHandle, studentId, cohort)
    .then(() => {
      res.end();
    })
    .catch(() => {
      res.end();
    });
});


// Remove a student from the cohort
app.delete('/api/cohorts/:cohort/students/:studentId', (req, res) => {
  const { cohort, studentId } = req.params;
  db.removeStudent(studentId, cohort)
    .then(() => db.getAllStudents(cohort))
    .then(students => res.send(students))
    .catch(() => res.sendStatus(400));
});


app.get('/api/cohorts/:cohort/problems', (req, res) => {
  const { cohort } = req.params;
  db.getAllProblems(cohort)
    .then(({ solvedSolutions }) => {
      res.send(solvedSolutions.map(problem => problem.problem));
    });
});

app.get('/api/cohorts/:cohort/problems/:problem', (req, res) => {
  const { cohort, problem } = req.params;
  db.getAllProblems(cohort)
    .then(({ solvedSolutions }) => {
      for (const problemSolutions of solvedSolutions) {
        if (problemSolutions.problem === problem) {
          res.send(problemSolutions.solutions);
        }
      }
    });
});

// TODO Loop through until error
// If you break this you are on your own
app.get('/api/cohorts/:cohort/problems/update', (req, res) => {
  const { cohort } = req.params;

  db.getLastPullCompleted(cohort)
    .then(lastPullCompleted => updateCohortProblems(cohort, lastPullCompleted))
    .then(solutions => Promise.all(solutions.filter(solution => (
      (solution && solution.githubHandle && solution.problemName && solution.solutionCode)))
      .map((solution) => {
        const { problemName, githubHandle, solutionCode } = solution;
        return db.addProblemSolution(cohort, problemName, githubHandle, solutionCode);
      })))
    .then(() => db.incrementPull(cohort))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = app;
