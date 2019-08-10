import React, { Component } from 'react';
import Axios from 'axios';
import Prism from 'prismjs';
import '../prism.css';

import AddStudent from './AddStudent';
import EditCohorts from './EditCohorts';
import Solutions from './Solutions';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentSubmissions: false,
      isLoading: false,
      emptyResults: false,
      page: null,
    };
  }

  getSubmissions(e) {
    e.preventDefault();
    const problemName = document.getElementById('problemName').value;
    const cohortPrefix = document.getElementById('cohortPrefix').value;
    this.setState({ isLoading: true }, () => {
      Axios.get(`/api/cohort/${cohortPrefix}/solutions/${problemName}`)
        .then((result) => {
          if (result.data.length) {
            this.setState({ studentSubmissions: result.data, isLoading: false });
          } else {
            this.setState({ emptyResults: true, isLoading: false });
          }
        });
    });
  }

  reset(e) {
    e.preventDefault();
    this.setState({ emptyResults: false, isLoading: false, studentSubmissions: false });
  }

  addStudent(e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const studentHandle = document.getElementById('studentHandle').value;
    const studentCohort = document.getElementById('studentCohort').value;
    console.log(studentName, studentHandle, studentCohort);
  }

  changePage(page) {
    this.setState({ page });
  }

  render() {
    if (this.state.page === 'solutions') {
      return (
        <>
          <Solutions />
        </>
      );
    }
    if (this.state.page === 'cohorts') {
      return (
        <>
          <EditCohorts />
        </>
      );
    }
    return (
      <div id={'wrapper'}>
        <button onClick={() => this.changePage('solutions')}>Solutions</button>
        <button onClick={() => this.changePage('cohorts')}>Cohorts</button>
      </div>
    );
    // if (this.state.isLoading) {
    //   return <div id='wrapper'><div className="lds-dual-ring"></div></div>;
    // } if (this.state.emptyResults) {
    //   return (
    //     <div id='wrapper'>
    //       <div className='empty'>Nothing Found</div>
    //       <button onClick={this.reset.bind(this)}>Reset</button>
    //     </div>
    //   );
    // }
    // if (this.state.studentSubmissions) {
    //   return (
    //     <div id={'submissions'}>
    //       {this.state.studentSubmissions.map((submission, i) => {
    //         const html = Prism.highlight(submission[2], Prism.languages.javascript, 'javascript');
    //         return (<div className={'submission'} key={i}>
    //           <h1>{submission[0]}</h1>
    //           <code dangerouslySetInnerHTML={{ __html: html }}></code>
    //         </div>
    //         );
    //       })}
    //       <button id={'submissionReset'} onClick={this.reset.bind(this)}>Reset</button>
    //     </div>
    //   );
    // }
    // return (
    //   <div id={'wrapper'}>
    //     <input type='text' placeholder='class prefix' id='cohortPrefix'></input>
    //     <input type='text' placeholder='problem' id='problemName'></input>
    //     <button type='submit' placeholder='submit' onClick={this.getSubmissions.bind(this)}>Submit</button>
    //     {/* <AddStudent addStudent={this.addStudent.bind(this)}/> */}
    //   </div>
    // );
  }
}

export default App;
