import React from 'react';
import PropTypes from 'prop-types';
import style from './tricky-cat.module.css';
import classNames from 'classnames';
import { useEffect, useState, useRef } from 'react';

export function TrickyCat({ catClick, changeCatImage }) {
  const [clicksOnCatCount, setClicksOnCatCount] = useState(0);
  const [showCatHands, setShowCatHands] = useState(false);
  const countRef = useRef(0);

  countRef.current = clicksOnCatCount;

  useEffect(() => {
    if (!catClick) {
      return;
    }

    const newClicks = countRef.current + 1;

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
  }, [catClick, setShowCatHands, changeCatImage]);

  const images = new Array(9)
    .fill()
    .map((_, i) => (
      <img
        className={classNames(style.hand)}
        src="/img/cat-hand.svg"
        key={i}
        alt=""
      ></img>
    ));

  return showCatHands ? (
    <div className={classNames(style.container)}>
      <div className={classNames(style.perspective)}>{images}</div>
    </div>
  ) : null;
}
TrickyCat.propTypes = {
  catClick: PropTypes.number,
  changeCatImage: PropTypes.func,
};
