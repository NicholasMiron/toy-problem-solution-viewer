import React, { Component } from 'react';
import '../prism.css';

import Axios from 'axios';
import Cohorts from './Cohorts';
import Problems from './Problems';
import Solutions from './Solutions';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home',
      currentCohort: '',
      cohorts: [],
      problems: [],
      solutions: [],
    };

    this.getCohortNames = this.getCohortNames.bind(this);
    this.updateProblems = this.updateProblems.bind(this);
    this.showProblems = this.showProblems.bind(this);
    this.showSolutions = this.showSolutions.bind(this);
    this.addCohort = this.addCohort.bind(this);
    this.removeCohort = this.removeCohort.bind(this);
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

  showProblems({ cohortPrefix }) {
    Axios.get(`/api/cohorts/${cohortPrefix}/problems`)
      .then(({ data }) => {
        this.setState({ problems: data, page: 'problems', currentCohort: cohortPrefix });
      });
  }

  showSolutions(problem) {
    Axios.get(`/api/cohorts/${this.state.currentCohort}/problems/${problem}`)
      .then(({ data }) => {
        const created = {};
        const solutions = data.reverse().filter((solution) => {
          if (!created[solution.username]) {
            created[solution.username] = 1;
            return true;
          } return false;
        });
        this.setState({ solutions, page: 'solutions' });
      });
  }

  updateProblems({ cohortPrefix }) {
    this.setState({ page: 'updating' }, () => {
      this.callUpdateProblem(cohortPrefix);
    });
  }

  callUpdateProblem(cohort) {
    Axios.get(`/api/cohorts/${cohort}/problems/update`)
      .then((response) => {
        if (response.status === 200) this.callUpdateProblem(cohort);
      }).catch(() => this.setState({ page: 'home' }));
  }


  addCohort() {
    const element = document.getElementById('addCohort');
    Axios.post(`/api/cohorts/${element.value}`)
      .then(this.getCohortNames);
  }

  removeCohort({ cohortPrefix }) {
    if (window.confirm('This action can\'t be undone! \n Do you still wish to proceed?')) {
      Axios.delete(`/api/cohorts/${cohortPrefix}`)
        .then(this.getCohortNames);
    }
  }


  render() {
    if (this.state.page === 'home') {
      return (
        <Cohorts
          cohorts={this.state.cohorts}
          showProblems={this.showProblems}
          updateProblems={this.updateProblems}
          addCohort={this.addCohort}
          removeCohort={this.removeCohort}
        />
      );
    }
    if (this.state.page === 'problems') {
      return (
        <Problems
          problems={this.state.problems}
          showSolutions={this.showSolutions}
        />
      );
    }
    if (this.state.page === 'solutions') {
      return (
        <Solutions solutions={this.state.solutions}/>
      );
    }
    return (
      <div>Loading...</div>
    );
  }
}

export default App;
