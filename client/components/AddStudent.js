import React from 'react';
import PropTypes from 'prop-types';

const AddStudent = ({ addStudent }) => (
    <>
      <input id={'studentName'} type={'text'} placeholder={'student name'}/>
      <input id={'studentHandle'} type={'text'} placeholder={'github handle'}/>
      <input id={'studentCohort'} type={'text'} placeholder={'cohort prefix'}/>
      <button onClick={addStudent}>+ Student</button>
    </>
);

AddStudent.propTypes = {
  addStudent: PropTypes.func,
};

export default AddStudent;
