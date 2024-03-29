import PropTypes from 'prop-types';
import React from 'react';

export function NoResults({ text }) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="level">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src="img/weary-cat.png" alt="" />
                </figure>
              </div>
            </div>
            <div className="control has-text-centered">
              <div className="h2 subtitle">{text}</div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </section>
  );
}
NoResults.propTypes = {
  text: PropTypes.string.isRequired,
};
