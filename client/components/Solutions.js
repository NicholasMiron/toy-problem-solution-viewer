import React from 'react';
import PropTypes from 'prop-types';

import Prism from 'prismjs';

const Solutions = ({ solutions }) => (
    <div id={'submissions'}>
      {solutions.map((submission, i) => {
        const html = Prism.highlight(submission.solution, Prism.languages.javascript, 'javascript');
        return (<div className={'submission'} key={i}>
            <h1>{submission.username}</h1>
            <code dangerouslySetInnerHTML={{ __html: html }}></code>
          </div>
        );
      })}
    </div>
);

Solutions.propTypes = {
  solutions: PropTypes.array,
};

export default Solutions;
