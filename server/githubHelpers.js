const Axios = require('axios');
require('dotenv').config();


const evaluateFractionString = (string) => {
  const split = string.split('/').map(item => Number(item.trim()));
  return split[0] / split[1];
};


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
  // We need to get the pull request first to get the username of the submission
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
      // This is nested so that we can grab the github handle from above later on
      return Axios(commentHeader)
        .then((commentResponse) => {
          // Go through all comments on the pull request and check for any passing solution
          const solutionsPromise = commentResponse.data.map((comment) => {
            const summary = comment.body.match(/(?<=summary:\W)\d{1,3}\W\/\W\d{1,3}/g);
            // Need to check for summary as not all comments have one
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
            return passing ? Axios(solutionHeader).then((html) => {
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
  updateCohortProblems,
};
