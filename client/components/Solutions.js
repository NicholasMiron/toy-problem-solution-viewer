import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Axios from 'axios';

import Cohorts from './Cohorts';
import Problems from './Problems';

class Solutions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cohorts: [],
      page: 'cohorts',
    };

    this.getProblemList = this.getProblemList.bind(this);
    this.updateProblems = this.updateProblems.bind(this);
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

  getProblemList(cohort) {
    Axios.get(`/api/cohorts/${cohort}/problems`)
      .then(({ data }) => {
        this.setState({ problems: data, page: 'problems' });
      });
  }

  updateProblems(cohort) {
    const { problems } = this.state;
    Axios.get(`/api/cohorts/${cohort}/problems/update`)
      .then((result) => {
        console.log(result, problems);
      });
  }

  render() {
    if (this.state.page === 'cohorts') {
      return (
        <Cohorts
          cohorts={this.state.cohorts}
          handleCohortClick={this.getProblemList}
          showUpdateProblems={true}
          updateProblems={this.updateProblems}
        />
      );
    }
    if (this.state.page === 'problems') {
      return (
        <Problems problems={this.state.problems}/>
      );
    }
    return <></>;
  }
}


export default Solutions;
