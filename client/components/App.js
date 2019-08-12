import React, { Component } from 'react';
import '../prism.css';

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

  reset(e) {
    e.preventDefault();
    this.setState({ emptyResults: false, isLoading: false, studentSubmissions: false });
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

    // return (
    //   <div id={'wrapper'}>
    //     <input type='text' placeholder='class prefix' id='cohortPrefix'></input>
    //     <input type='text' placeholder='problem' id='problemName'></input>
    //     <button
    //       type='submit'
    //       placeholder='submit'
    //       onClick={this.getSubmissions.bind(this)}
    //     >
    //       Submit
    //     </button>;
    //     {/* <AddStudent addStudent={this.addStudent.bind(this)}/> */}
    //   </div>
    // );
  }
}

export default App;
