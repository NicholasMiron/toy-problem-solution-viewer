import React, { Component } from 'react';
import Axios from 'axios';

import Cohorts from './Cohorts';
import Students from './Students';

class EditCohorts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cohorts: [],
      page: 'cohorts',
      currentCohort: '',
      students: [],
    };

    this.addStudent = this.addStudent.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.removeCohort = this.removeCohort.bind(this);
    this.getStudentsFromCohort = this.getStudentsFromCohort.bind(this);
    this.updateStudentInfo = this.updateStudentInfo.bind(this);
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

  getStudentsFromCohort(cohort) {
    Axios.get(`/api/cohorts/${cohort}/students`)
      .then(({ data }) => {
        this.setState({ students: data, page: 'editStudents', currentCohort: cohort });
      });
  }

  updateStudentInfo(e, studentId) {
    const cohort = this.state.currentCohort;


    const githubHandle = document.getElementById(`handle${studentId}`).value;
    const name = document.getElementById(`name${studentId}`).value;


    Axios.patch(`/api/cohorts/${cohort}/students/${studentId}`, {
      name, githubHandle,
    })
      .catch((err) => {
        console.log(err);
      });
  }

  addStudent(e) {
    e.preventDefault();
    const cohort = this.state.currentCohort;
    const studentForm = document.getElementById('addStudent');
    const newStudentFormData = new FormData(studentForm);

    Axios.post(`/api/cohorts/${cohort}/students`, {
      name: newStudentFormData.get('name'),
      githubHandle: newStudentFormData.get('githubHandle'),
    })
      .then(({ data }) => {
        this.setState({ students: data });
        studentForm.reset();
      });
  }

  removeStudent(studentId) {
    const cohort = this.state.currentCohort;
    Axios.delete(`/api/cohorts/${cohort}/students/${studentId}`)
      .then(({ data }) => {
        this.setState({ students: data });
      });
  }

  addCohort(e) {
    e.preventDefault();
    const addCohortForm = document.getElementById('addCohort');
    const newCohortData = new FormData(addCohortForm);

    Axios.post(`/api/cohorts/${newCohortData.get('name')}`)
      .then(({ data }) => {
        this.setState({ cohorts: data });
      })
      .catch(() => {
        alert('Cohort already exists');
      })
      .then(() => {
        addCohortForm.reset();
      });
  }

  removeCohort({ cohortPrefix }) {
    Axios.delete(`/api/cohorts/${cohortPrefix}`)
      .then(({ data }) => {
        this.setState({ cohorts: data });
      });
  }

  render() {
    if (this.state.page === 'cohorts') {
      return (
        <div className={'column'}>
          <Cohorts
            cohorts={this.state.cohorts}
            handleCohortClick={this.getStudentsFromCohort}
            editCohort={true}
            removeCohort={this.removeCohort}
          />
          <form className={'columnItem shortItem'} id={'addCohort'}>
            <input name={'name'} type={'text'} placeholder={'Cohort Name'}></input>
            <input type={'submit'} value={'+ Cohort'} onClick={e => this.addCohort(e)}></input>
          </form>
        </div>
      );
    }
    if (this.state.page === 'editStudents') {
      return (
        <Students
          students={this.state.students}
          updateStudentInfo={this.updateStudentInfo}
          addStudent={this.addStudent}
          removeStudent={this.removeStudent}
        />
      );
    }
    return <></>;
  }
}

export default EditCohorts;
