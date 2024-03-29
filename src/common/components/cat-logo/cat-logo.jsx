import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import style from './cat-logo.module.css';

export function CatLogo({
  size = 's',
  isRight = true,
  catType = 'default',
  styles = [],
  onClick = null,
}) {
  const sizeMap = {
    s: style.small,
    l: style.large,
  };
  const catImageMap = {
    default: 'cat',
    weary: 'weary-cat',
    modal: 'cat-modal',
    tricky: 'cat-tricky',
  };

  return (
    <figure
      className={classNames(
        'image',
        { 'is-pulled-right': isRight },
        sizeMap[size],
        ...styles
      )}
      onClick={event => onClick && onClick(event)}
    >
      <img
        src={`img/${catImageMap[catType]}.png`}
        alt=""
        data-autotest-id="cat-logo"
      />
    </figure>
  );
}
CatLogo.propTypes = {
  size: PropTypes.oneOf(['s', 'l']),
  isRight: PropTypes.bool,
  catType: PropTypes.oneOf(['default', 'weary', 'modal', 'tricky']),
  styles: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};
