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
          <div onClick={() => showProblems(cohort)}>{cohort.cohortPrefix}</div>
          <button onClick={() => showProblems(cohort)}>Problems</button>
          <button onClick={() => updateProblems(cohort)}>Update Problems</button>
          <button className={'remove'} onClick={() => removeCohort(cohort)}>Remove Cohort</button>
        </div>
      ))}
      <div className={'columnItem shortItem'}>
        <input id={'addCohort'} type='text' placeholder={'Cohort Prefix (Format: hrXXX##)'}></input>
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
