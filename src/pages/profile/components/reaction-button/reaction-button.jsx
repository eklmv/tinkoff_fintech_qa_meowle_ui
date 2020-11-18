import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './reaction-button.module.css';
import { Icon } from '../../../../common/components/icon/icon';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

const emojiMap = {
  like: faThumbsUp,
  dislike: faThumbsDown,
};
const titleMap = {
  like: 'Лайкнуть',
  dislike: 'Убрать лайк',
};
const countField = {
  like: 'likes',
  dislike: 'dislikes',
};

export function ReactionButton({
  catInfo,
  type = 'like',
  reacted,
  loading,
  click,
}) {
  const styleReacted = reacted && !loading ? styles['is-reacted'] : 'is-light';

  return (
    <button
      className={classNames(
        'button',
        'is-small',
        styles['reaction-button'],
        styleReacted,
        {
          'is-loading': loading,
        }
      )}
      disabled={loading}
      type="button"
      title={titleMap[type]}
      onClick={click}
    >
      <Icon icon={emojiMap[type]} />
      &nbsp;<span>{catInfo[countField[type]]}</span>
    </button>
  );
}
ReactionButton.propTypes = {
  catInfo: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['like', 'dislike']).isRequired,
  reacted: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
};
