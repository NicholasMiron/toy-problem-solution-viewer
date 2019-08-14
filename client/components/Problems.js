import React from 'react';
import PropTypes from 'prop-types';

const Problems = ({ problems, showSolutions }) => (
    <div className={'column'}>
      {problems.map((problem, i) => (
        <div className={'columnItem shortItem'} key={i}>
          <div className={'name clickable'} onClick={() => showSolutions(problem)}>{problem}</div>
        </div>
      ))}
    </div>
);

Problems.propTypes = {
  problems: PropTypes.func,
  showSolutions: PropTypes.func,
};

export default Problems;
