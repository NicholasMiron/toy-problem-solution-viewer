import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Axios from 'axios';
import Prism from 'prismjs';

import Cohorts from './Cohorts';
import Problems from './Problems';

class Solutions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cohorts: [],
      solutions: [],
      page: 'cohorts',
      currentCohort: '',
    };

    this.getListOfProblems = this.getListOfProblems.bind(this);
    this.updateProblems = this.updateProblems.bind(this);
    this.getSolutionsForProblem = this.getSolutionsForProblem.bind(this);
  }

  componentDidMount() {
    this.getCohortNames();
  }

  getCohortNames() {
    Axios.get('/api/cohorts')
      .then(({ data }) => {
        this.setState({ cohorts: data });
      });
  }

  getSolutionsForProblem(problem) {
    Axios.get(`/api/cohorts/${this.state.currentCohort}/problems/${problem}`)
      .then(({ data }) => {
        this.setState({ solutions: data, page: 'solutions' });
      });
  }

  getListOfProblems({ cohortPrefix }) {
    Axios.get(`/api/cohorts/${cohortPrefix}/problems`)
      .then(({ data }) => {
        this.setState({ problems: data, page: 'problems', currentCohort: cohortPrefix });
      });
  }

  updateProblems({ cohortPrefix }) {
    Axios.get(`/api/cohorts/${cohortPrefix}/problems/update`)
      .then((response) => {
        if (response.status === 200) this.updateProblems({ cohortPrefix });
      });
  }

  render() {
    if (this.state.page === 'cohorts') {
      return (
        <Cohorts
          cohorts={this.state.cohorts}
          handleCohortClick={this.getListOfProblems}
          showUpdateProblems={true}
          updateProblems={this.updateProblems}
        />
      );
    }
    if (this.state.page === 'problems') {
      return (
        <Problems problems={this.state.problems} showSolutions={this.getSolutionsForProblem}/>
      );
    }
    if (this.state.page === 'solutions') {
      return (
        <div id={'submissions'}>
          {this.state.solutions.map((submission, i) => {
            const html = Prism.highlight(submission.solution, Prism.languages.javascript, 'javascript');
            return (<div className={'submission'} key={i}>
                <h1>{submission.username}</h1>
                <code dangerouslySetInnerHTML={{ __html: html }}></code>
              </div>
            );
          })}
        </div>
      );
    }
    return <></>;
  }
}


export default Solutions;
