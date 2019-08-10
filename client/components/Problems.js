import React from 'react';
import PropTypes from 'prop-types';

const Problems = ({ problems }) => (
    <div className={'column'}>
      {problems.map((problem, i) => (
        <div className={'columnItem shortItem'} key={i}>
          <div>{problem}</div>
        </div>
      ))}
    </div>
);

Problems.propTypes = {
  problems: PropTypes.func,
};

export default Problems;
