import React from 'react';
import PropTypes from 'prop-types';

const Students = ({
  students, updateStudentInfo, removeStudent, addStudent,
}) => (
    <div className={'column'}>
          <div className={'columnItem shortItem'}>
            <div>Student Name</div>
            <div>Github Handle</div>
            <div>Remove Student</div>
          </div>
          {students.map((student, i) => (
            <div className={'columnItem shortItem'} key={student.name + i}>
              <input
                id={`name${student._id}`}
                onBlur={e => updateStudentInfo(e, student._id)}
                type={'text'}
                defaultValue={student.name}
              ></input>
              <input
                id={`handle${student._id}`}
                onBlur={e => updateStudentInfo(e, student._id)}
                type={'text'}
                defaultValue={student.githubHandle}
              ></input>
              <button className={'remove'} onClick={() => removeStudent(student._id)}>Remove Student</button>
            </div>
          ))}
          <form className={'columnItem shortItem'} id={'addStudent'}>
            <input name={'name'} type={'text'} placeholder={'Student Name'}></input>
            <input name={'githubHandle'} type={'text'} placeholder={'Github Handle'}></input>
            <input type={'submit'} value={'+ Student'} onClick={e => addStudent(e)}></input>
          </form>
        </div>
);

Students.propTypes = {
  students: PropTypes.array,
  updateStudentInfo: PropTypes.func,
  removeStudent: PropTypes.func,
  addStudent: PropTypes.func,
};

export default Students;
