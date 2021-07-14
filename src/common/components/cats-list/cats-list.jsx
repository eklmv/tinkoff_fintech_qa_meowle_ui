import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CatsApi } from '../../../api/cats';
import { CatLogo } from '../cat-logo';
import { GenderIcon } from '../gender-icon';
import style from './cats-list.module.css';
import { Filter } from '../filter/filter';
import { useQuery } from '../../../utils/query';
import history from '../../../utils/history';

export function CatsList({ searchValue }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setGroups] = useState(null);
  const [error, setError] = useState(null);

  const query = useQuery();
  const { pathname } = useLocation();

  const gender = query.get('gender');
  const order = query.get('order');

  useEffect(() => {
    if (searchValue && searchValue.toLowerCase() === 'кос') {
      document.body.style.transform = 'rotate(2deg)';
    }
    const apiMethod = searchValue
      ? CatsApi.search(searchValue, gender, order)
      : CatsApi.getAllByLetter({ gender, order });

    setLoading(true);
    apiMethod
      .then(data => {
        setGroups(data);
        setError(null);
      })
      .catch(error => {
        setError(error || new Error(searchValue));
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      document.body.style.transform = null;
    };
  }, [searchValue, gender, order]);

  const changeFilterAndSort = (filter, order) => {
    const gender = filter ? `gender=${filter}` : '';

    order = order ? `order=${order}` : '';

    let search = [gender, order].filter(v => v);

    search = search ? `?${search.join('&')}` : null;

    history.push({
      pathname,
      search,
    });
  };

  return isLoading ? null : error ? (
    <Error />
  ) : data?.count_all || data?.count ? (
    <Results
      data={data}
      filter={gender}
      order={order}
      onChange={changeFilterAndSort}
    />
  ) : searchValue ? (
    <NoResults text="Упс! Ничего не нашли" name={searchValue} />
  ) : null;
}
CatsList.propTypes = {
  searchValue: PropTypes.string,
};

function Error(searchValue) {
  return (
    <NoResults text="Ошибка загрузки котов" name={searchValue}></NoResults>
  );
}

function NoResults({ text, name }) {
  console.log(name.length);
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="level">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src="/img/weary-cat.png" alt="" />
                </figure>
              </div>
            </div>
            <div className="control has-text-centered">
              <div className="h2 subtitle">{text}</div>
            </div>
            <br />
            {name.length <= 35 ? (
              <div className="control has-text-centered">
                <AddCat name={name} />{' '}
              </div>
            ) : (
              <div className="control has-text-centered">
                <div className="h2 subtitle">Имя слишком длинное</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
NoResultsWithAddButton.propTypes = {
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function Results({ data, filter, order, onChange }) {
  return (
    <>
      <section className={classNames('section', style.filter)}>
        <div className="container">
          <div className="columns">
            <div className="column is-2"></div>
            <Filter
              count={data.count_by_letter}
              filter={filter}
              order={order}
              onChange={onChange}
            />
            <div className="column">
              <div className="is-pulled-right has-text-grey is-size-7">
                {data.count_all}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-2 is-hidden-mobile">
              <CatLogo />
            </div>
            <div className="column is-10">
              <Groups groups={data.groups} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
Results.propTypes = {
  data: PropTypes.object.isRequired,
  filter: PropTypes.oneOf([null, 'male', 'female', 'unisex']),
  order: PropTypes.oneOf([null, 'asc', 'desc']),
  onChange: PropTypes.func.isRequired,
};

function Groups(props) {
  return props.groups.map((group, i) => <Group group={group} key={i} />);
}
Groups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Group({ group: { title, count_by_letter, count_in_group, cats } }) {
  const [data, dataLoaded] = useState(cats);
  const [offset, setOffset] = useState(0);
  const displayArrow = count_by_letter > count_in_group;
  const start = offset * 5 + 1;
  const end = Math.min((offset + 1) * 5, count_by_letter);
  const handleArrowClick = (changeOffsetBy, disabled) => () => {
    if (disabled) {
      return;
    }
    const newOffset = offset + changeOffsetBy;
    setOffset(newOffset);
    CatsApi.getSuggestions(title, 5, newOffset * 5).then(res => {
      dataLoaded(res.cats);
    });
  };
  const leftArrowDisabled = offset === 0;
  const rightArrowDisabled = end === count_by_letter;
  return (
    <div className={style.group}>
      <div className={style.groupHeader}>
        <span className="title is-4">{title}</span>
        <span className="is-pulled-right has-text-grey is-size-7">
          {displayArrow && `${start === end ? '' : `${start}-`}${end} / `}
          {count_by_letter}
        </span>
      </div>
      <div className={style.namesWrapper}>
        {displayArrow && (
          <span
            onClick={handleArrowClick(-1, leftArrowDisabled)}
            className={classNames('tag', 'is-size-5', style.leftArrow, {
              [style.arrowDisabled]: leftArrowDisabled,
            })}
          >
            {'<'}
          </span>
        )}
        <Cats cats={data} />
        {displayArrow && (
          <span
            onClick={handleArrowClick(1, rightArrowDisabled)}
            className={classNames('tag', 'is-size-5', style.rightArrow, {
              [style.arrowDisabled]: rightArrowDisabled,
            })}
          >
            {'>'}
          </span>
        )}
      </div>
    </div>
  );
}
Group.propTypes = {
  group: PropTypes.object.isRequired,
};

function Cats(props) {
  const catsEl = props.cats.map(cat => <Cat cat={cat} key={cat.id} />);

  return <div className="tags">{catsEl}</div>;
}
Cats.propTypes = {
  cats: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Cat({ cat: { id, name, gender } }) {
  const link = `/cats/${id}`;

  return (
    <span className={classNames('tag', 'is-size-5', style.name)}>
      <GenderIcon gender={gender} />
      <Link to={link} className={classNames('has-text-black', style.name_link)}>
        {name}
      </Link>
    </span>
  );
}
Cat.propTypes = {
  cat: PropTypes.object.isRequired,
};

function AddCat({ name }) {
  return (
    <Link
      to={`/cats/add/${name}`}
      className="button is-warning is-medium"
      style={{ display: 'block' }}
    >
      <span
        style={{
          display: 'block',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        }}
      >
        <span>Добавить&nbsp;</span>
        <span className="has-text-weight-bold">{name}</span>
        <span>&nbsp;в базу?</span>
      </span>
    </Link>
  );
}
AddCat.propTypes = {
  name: PropTypes.string.isRequired,
};
