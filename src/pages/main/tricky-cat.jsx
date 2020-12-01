import React from 'react';
import PropTypes from 'prop-types';
import style from './cat-tricky.module.css';
import classNames from 'classnames';
import { useEffect, useState, useRef } from 'react';

export function TrickyCat({ catClick, changeCatImage }) {
  const [clicksOnCatCount, setClicksOnCatCount] = useState(0);
  const [showCatHands, setShowCatHands] = useState(0);
  const countRef = useRef(0);

  countRef.current = clicksOnCatCount;

  useEffect(() => {
    if (!catClick) {
      return;
    }

    const newClicks = clicksOnCatCount + 1;

    setClicksOnCatCount(newClicks);

    if (newClicks > 1) {
      return;
    }

    setTimeout(() => {
      if (countRef.current >= 3) {
        setShowCatHands(true);
        changeCatImage();
      }
      setClicksOnCatCount(0);
    }, 500);
  }, [catClick]);

  return showCatHands ? (
    <div className={classNames(style.container)}>
      <div className={classNames(style.perspective)}>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
        <img className={classNames(style.hand)} src="/img/cat-hand.svg"></img>
      </div>
    </div>
  ) : null;
}
TrickyCat.propTypes = {
  catClick: PropTypes.number,
  changeCatImage: PropTypes.func,
};
