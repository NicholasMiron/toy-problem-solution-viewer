import React from 'react';
import PropTypes from 'prop-types';

const Cohorts = ({
  cohorts,
  showProblems,
  removeCohort,
  updateProblems,
  addCohort,
}) => (
    <div className={'column'}>
      {cohorts.map((cohort, i) => (
        <div className={'columnItem shortItem'} key={i}>
          <div className={'name'} onClick={() => showProblems(cohort)}>{cohort.cohortPrefix}</div>
          <button className={'clickable'} onClick={() => showProblems(cohort)}>Problems</button>
          <button className={'clickable'} onClick={() => updateProblems(cohort)}>Update Problems</button>
          <button className={'remove clickable'} onClick={() => removeCohort(cohort)}>Remove Cohort</button>
        </div>
      ))}
      <div className={'columnItem shortItem'}>
        <input id={'addCohort'} type='text' placeholder={'Prefix (Format: hrXXX##)'}></input>
        <button onClick={() => addCohort()}>{'+ Cohort'}</button>
      </div>
  </div>
);

Cohorts.propTypes = {
  cohorts: PropTypes.array,
  showProblems: PropTypes.func,
  removeCohort: PropTypes.func,
  updateProblems: PropTypes.func,
  addCohort: PropTypes.func,
};

export default Cohorts;
