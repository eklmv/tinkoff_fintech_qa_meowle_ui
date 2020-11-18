import React, { useState, useEffect } from 'react';
import { useParams, Switch, Route, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Header } from '../../common/components/header';
import { CatLogo } from '../../common/components/cat-logo';
import { GenderIcon } from '../../common/components/gender-icon';
import { CatsApi } from '../../api/cats';
import { Description } from './components/description';
import { ReactionButton } from './components/reaction-button/reaction-button';
import { Photos } from './components/photos/photos';
import style from './profile.module.css';
import { PhotosApi } from '../../api/photos';
import { notify } from '../../utils/notifications/notifications';
import { ReactionApi } from '../../api/reaction';
import { storage } from '../../utils/storage';

export function ProfilePage() {
  const match = useRouteMatch();
  const { catId } = useParams();
  const [catInfo, updateInfo] = useState(null);
  const [catPhotos, updateCatPhotos] = useState([]);

  const updateInfoHandler = newCatInfo =>
    updateInfo({ ...catInfo, ...newCatInfo });

  useEffect(() => {
    loadCatProfile(catId, updateInfo);
    loadCatPhotos(catId, updateCatPhotos);
  }, [catId]);

  const info = catInfo ? (
    <>
      <Info
        catInfo={catInfo}
        path={match.path}
        updateInfo={updateInfoHandler}
      />
      <Photos catId={catInfo.id} links={catPhotos} />
    </>
  ) : null;

  return (
    <>
      <Header />
      {info}
    </>
  );
}

function loadCatProfile(id, updateHandler) {
  return CatsApi.getById(id).then(({ cat }) => updateHandler(cat));
}

function loadCatPhotos(id, updateHandler) {
  return PhotosApi.getCatPhoto(id)
    .then(links => updateHandler(links))
    .catch(message => {
      notify.error(message || 'Ошибка получения фотографий');
    });
}

function Info({ catInfo, path, updateInfo }) {
  const _onChangeDescription = onChangeDescription.bind(null, updateInfo);

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo />
          </div>
          <div className="column">
            <Switch>
              <Route path={`${path}/edit`}>
                <Title catInfo={catInfo} />
                <Description
                  className="description"
                  catId={catInfo.id}
                  text={catInfo.description}
                  isEdit={true}
                  onChangeDescription={_onChangeDescription}
                />
              </Route>
              <Route path={path}>
                <Title catInfo={catInfo} updateInfo={updateInfo} />
                <Description
                  className="description"
                  catId={catInfo.id}
                  text={catInfo.description}
                />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </section>
  );
}
Info.propTypes = {
  catInfo: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  updateInfo: PropTypes.func.isRequired,
};

function Title({ catInfo, updateInfo }) {
  const [loading, setLoading] = useState(false);
  const [reactionType, setReactionType] = useState(
    (storage.likes.exist(catInfo.id) && 'like') ||
      (storage.dislikes.exist(catInfo.id) && 'dislike') ||
      storage.reactions.exist(catInfo.id)
  );

  const likes = updateInfo ? (
    <>
      <ReactionButton
        catInfo={catInfo}
        type="like"
        loading={loading}
        reacted={reactionType === 'like'}
        click={onLikeReacted}
      />
      <ReactionButton
        catInfo={catInfo}
        type="dislike"
        loading={loading}
        reacted={reactionType === 'dislike'}
        click={onDislikeReacted}
      />
    </>
  ) : null;

  function onLikeReacted() {
    sendReacted('like');
  }

  function onDislikeReacted() {
    sendReacted('dislike');
  }

  function sendReacted(type) {
    const reactions = {
      [type]: reactionType !== type,
    };
    const inverseType = { like: 'dislike', dislike: 'like' }[type];

    if (reactionType === inverseType) {
      reactions[inverseType] = false;
    }

    setLoading(true);
    ReactionApi.likes(catInfo.id, reactions)
      .then(response => {
        updateInfo(response);
      })
      .catch(message => {
        notify.error(message);
      })
      .then(() => {
        const newReaction = reactionType === type ? null : type;

        setReactionType(newReaction);

        if (newReaction) {
          storage.reactions.set(catInfo.id, newReaction);
        } else {
          storage.reactions.remove(catInfo.id);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={classNames('title', 'is-3', style.title)}>
      Значение имени {catInfo.name}
      &nbsp;
      <GenderIcon gender={catInfo.gender} />
      {likes}
    </div>
  );
}
Title.propTypes = {
  catInfo: PropTypes.object.isRequired,
  updateInfo: PropTypes.func,
};

function onChangeDescription(updateInfoHandler, newDescription) {
  updateInfoHandler({ description: newDescription });
}
