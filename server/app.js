const express = require('express');

const db = require('../db/db');
const { updateCohortProblems } = require('./githubHelpers');

const app = express();
app.use(require('morgan')('dev')); // Logs all inbound requests to console

app.use(express.json());
app.use(express.static('dist'));


// TODO: move routes to seperate file

// Get all cohorts
app.get('/api/cohorts', (req, res) => {
  db.getAllCohorts()
    .then((response) => {
      res.send(response);
    })
    .catch(() => res.sendStatus(400));
});

// Add cohort
app.post('/api/cohorts/:cohort/', (req, res, next) => {
  let { cohort } = req.params;

  cohort = cohort.toLowerCase();
  // Must match the hr standard naming convention
  if (!/^hr(atx|nyc|hrr|sf|phx|la|rpt)\d{1,3}$/gi.test(cohort)) {
    res.sendStatus(400);
    next();
  } else {
    db.getCohort(cohort)
      .then((result) => {
        if (result) { // If we find something break
          res.send(409);
          next();
        }
        return db.addCohort(cohort);
      })
      .then(() => db.getAllCohorts())
      .then(data => res.send(data))
      .catch(() => res.sendStatus(401));
  }
});

// Remove cohort
app.delete('/api/cohorts/:cohort', (req, res) => {
  const { cohort } = req.params;

  db.removeCohort(cohort)
    .then(() => db.getAllCohorts())
    .then(result => res.send(result))
    .catch(() => res.sendStatus(400));
});


// Check the next pull request for a solution
// Client calls this again on sucess (trying to not send too many requests to github all at once)
// If you break this you are on your own
app.get('/api/cohorts/:cohort/problems/update', (req, res) => {
  const { cohort } = req.params;
  let lastPull = 0;

  db.getLastPullCompleted(cohort)
    .then((lastPullCompleted) => {
      lastPull = lastPullCompleted;
      return updateCohortProblems(cohort, lastPullCompleted);
    })
    .then(solutions => Promise.all(solutions.filter(solution => (
      (solution && solution.githubHandle && solution.problemName && solution.solutionCode)))
      .map((solution) => {
        const { problemName, githubHandle } = solution;
        let { solutionCode } = solution;
        // If code not displaying properly remove line below
        solutionCode = solutionCode.replace(/(\/\*(.*?)\*\/)|(\/\/.*?\n)/gis, '').trim();
        return db.addProblemSolution(cohort, problemName, githubHandle, solutionCode);
      })))
    .then(() => db.incrementPull(cohort))
    .then(() => res.send(JSON.stringify(lastPull)))
    .catch(() => res.sendStatus(400));
});

// Get all problem names for a cohort in an array
app.get('/api/cohorts/:cohort/problems', (req, res) => {
  const { cohort } = req.params;
  db.getAllProblems(cohort)
    .then(({ solvedSolutions }) => {
      res.send(solvedSolutions.map(problem => problem.problem));
    });
});

// Get all solutions for a problem
app.get('/api/cohorts/:cohort/problems/:problem', (req, res) => {
  const { cohort, problem } = req.params;
  db.getAllProblems(cohort)
    .then(({ solvedSolutions }) => {
      for (const problemSolutions of solvedSolutions) {
        if (problemSolutions.problem === problem) {
          res.send(problemSolutions.solutions);
          break;
        }
      }
    })
    .catch(() => res.sendStatus(400));
});


module.exports = app;
