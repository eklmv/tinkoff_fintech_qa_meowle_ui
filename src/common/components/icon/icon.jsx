import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export function Icon({ icon, className, elementId }) {
  return (
    <span id={elementId} className={classNames('icon', classNames(className))}>
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}
Icon.propTypes = {
  icon: PropTypes.any.isRequired,
  className: PropTypes.string,
  elementId: PropTypes.string,
};
