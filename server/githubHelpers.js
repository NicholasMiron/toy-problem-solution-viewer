const Axios = require('axios');
require('dotenv').config();

const students = require('../configStudent');

const evaluateFractionString = (string) => {
  const split = string.split('/').map(item => Number(item.trim()));
  return split[0] / split[1];
};

// Get all students solutions for a cohort
const getCode = (problem, cohort) => {
  const studentSolutions = students.map((student) => {
    const options = {
      url: `https://api.github.com/repos/${student[0]}/${cohort}-toy-problems/contents/${problem}/${problem}.js`,
      headers: {
        'User-Agent': 'request',
        Authorization: `token ${process.env.GITHUB_API}`,
      },
    };

    return Axios(options)
      .then(({ data }) => {
        const lines = data.content.split('\n');

        let code = '';
        for (const line of lines) {
          code += Buffer.from(line, 'base64').toString();
        }
        return [student[1], student[0], code]; // [name, handle, code]
      })
      .catch(() => {});
  });

  return studentSolutions;
};

const getPulls = (studentCode, cohort) => studentCode.map((student) => {
  const pulls = {
    url: `https://api.github.com/repos/hackreactor/${cohort}-toy-problems/pulls?state=closed&base=${student[1]}&direction=desc`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${process.env.GITHUB_API}`,
    },
  };

  // Get student scores
  return Axios(pulls)
    .then(pullsResponse => pullsResponse.data.map(pull => pull._links.comments.href));
});

const getComments = (allCommentUrls, problem) => (
  allCommentUrls.map((studentCommentUrl) => {
    const scoresPromise = studentCommentUrl.map((url) => {
      const comments = {
        url,
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${process.env.GITHUB_API}`,
        },
      };

      return Axios(comments)
        .then((allCommentInfo) => {
          for (const commentInfo of allCommentInfo.data) {
            const comment = commentInfo.body;
            if (new RegExp(problem).test(comment)) {
              const summaryRegex = /\d{1,3}\W*\/\W*\d{1,3}/g;
              const summary = comment.match(summaryRegex);
              return summary;
            }
          }
          return null;
        })
        .catch(() => {});
    });


    return Promise.all(scoresPromise)
      .then(scores => scores.filter(score => !!score))
      .then(scores => scores.flat())
      .then((filterScores) => {
        const passing = [];
        for (const score of filterScores) {
          const evaluated = evaluateFractionString(score);
          if (evaluated >= 1) passing.push(1);
          else passing.push(0);
        }
        return passing;
      });
  })
);

// Check if a pull request has any passing solutions and return it if it does.
// It seems to occasionally not get everything. I'm not sure why.
// TODO Simplify the headers for each request
// TODO Break each Axios call into its own function
const updateCohortProblems = (cohort, lastPull) => {
  const pullHeader = {
    url: `https://api.github.com/repos/hackreactor/${cohort}-toy-problems/pulls/${lastPull + 1}`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${process.env.GITHUB_API}`,
    },
  };

  // Get the pull request
  return Axios(pullHeader)
    .then((pullResponse) => {
      const githubHandle = pullResponse.data.head.user.login;

      const commentHeader = {
        url: pullResponse.data._links.comments.href,
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${process.env.GITHUB_API}`,
        },
      };

      // Get the comments on that pull request
      return Axios(commentHeader)
        .then((commentResponse) => {
          const solutionsPromise = commentResponse.data.map((comment) => {
            const summary = comment.body.match(/(?<=summary:\W)\d{1,3}\W\/\W\d{1,3}/g);
            const passing = summary ? evaluateFractionString(summary[0]) >= 1 : false;
            const problemName = passing ? comment.body.match(/(?<=Problem:\W)\D{1,}(?=\n)/g)[0].trim() : null;

            const solutionHeader = {
              url: `https://api.github.com/repos/hackreactor/${cohort}-toy-problems/contents/${problemName}/${problemName}.js?ref=${githubHandle}`,
              headers: {
                'User-Agent': 'request',
                Authorization: `token ${process.env.GITHUB_API}`,
              },
            };

            // If a comment has a passing solution get the solution
            return passing ? Axios(solutionHeader).catch(err => console.log('ERROR: checking solution', err)).then((html) => {
              const solutionCode = Buffer.from(html.data.content, 'base64').toString();
              return { githubHandle, problemName, solutionCode };
            }) : null;
          });

          // Wait for all solved solutions to come back
          return Promise.all(solutionsPromise);
        })
        .catch(error => error);
    });
};


module.exports = {
  getCode, getPulls, getComments, updateCohortProblems,
};
