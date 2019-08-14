import React, { Component } from 'react';
import Axios from 'axios';

import Cohorts from './Cohorts';
import Problems from './Problems';
import Solutions from './Solutions';

import '../prism.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home',
      currentCohort: '',
      cohorts: [],
      problems: [],
      solutions: [],
      lastPull: 0,
    };

    this.initalState = Object.assign({}, this.state);

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
        if (response.status === 200) {
          this.setState({ lastPull: response.data }, () => this.callUpdateProblem(cohort));
        }
      })
      .catch(() => this.setState({ page: 'home' }));
  }


  addCohort() {
    const element = document.getElementById('addCohort');
    Axios.post(`/api/cohorts/${element.value}`)
      .then(() => {
        this.getCohortNames();
      })
      .catch((err) => {
        switch (err.response.status) {
          case 400:
            alert('Incorrectly Formatted');
            break;
          case 409:
            alert('Already Exists');
            break;
          default:
            alert('Failed to post');
            break;
        }
      })
      .finally(() => { element.value = ''; });
  }

  removeCohort({ cohortPrefix }) {
    if (window.confirm('This action can\'t be undone! Do you still wish to proceed?')) {
      Axios.delete(`/api/cohorts/${cohortPrefix}`)
        .then(this.getCohortNames);
    }
  }

  goHome() {
    this.setState(this.initalState);
  }


  render() {
    if (this.state.page === 'home') {
      return (
        <>
          <Cohorts
            cohorts={this.state.cohorts}
            showProblems={this.showProblems}
            updateProblems={this.updateProblems}
            addCohort={this.addCohort}
            removeCohort={this.removeCohort}
          />
          {/* <button id={'goHome'} onClick={this.goHome}>Home</button> */}
        </>
      );
    }
    if (this.state.page === 'problems') {
      return (
        <>
          <Problems
            problems={this.state.problems}
            showSolutions={this.showSolutions}
          />
          {/* <button id={'goHome'} onClick={this.goHome}>Home</button> */}
        </>
      );
    }
    if (this.state.page === 'solutions') {
      return (
        <>
          <Solutions solutions={this.state.solutions}/>
          {/* <button id={'goHome'} onClick={this.goHome}>Home</button> */}
        </>
      );
    }
    return (
      <div className='bigParent'>
        <div className='lastPull'>
          <span>Getting Info From Pull Request </span>
          <span className="loading">
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
          </span>
          <span>{`${this.state.lastPull}`}</span>
        </div>
      </div>
    );
  }
}

export default App;
