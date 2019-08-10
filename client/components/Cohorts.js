import React from 'react';
import PropTypes from 'prop-types';

const Cohorts = ({
  cohorts,
  handleCohortClick,
  editCohort = false,
  removeCohort,
  showUpdateProblems = false,
  updateProblems,
}) => (
    <div className={'column'}>
      {cohorts.map((cohort, i) => (
        <div className={'columnItem shortItem'} key={i}>
          <div onClick={() => handleCohortClick(cohort)}>{cohort.cohortPrefix}</div>
          {editCohort
            ? <button className={'remove'} onClick={() => removeCohort(cohort)}>Remove Cohort</button>
            : <></>
          }
          {showUpdateProblems
            ? <button onClick={() => updateProblems(cohort)}>Update Problems</button>
            : <></>
            }
        </div>
      ))}
  </div>
);

Cohorts.propTypes = {
  cohorts: PropTypes.array,
  handleCohortClick: PropTypes.func,
  editCohort: PropTypes.bool,
  removeCohort: PropTypes.func,
  showUpdateProblems: PropTypes.bool,
  updateProblems: PropTypes.func,
};

export default Cohorts;
