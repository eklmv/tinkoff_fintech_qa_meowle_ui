import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useLocation, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PhotosApi } from '../../../../api/photos';
import { notify } from '../../../../utils/notifications/notifications';
import style from './photos.module.css';
import history from '../../../../utils/history';

export function Photos({ catId, links: _links }) {
  const [links, updateLinks] = useState(_links);
  const onCompleteUpload = link => updateLinks([link, ...links]);

  useEffect(() => {
    updateLinks(_links);
  }, [_links]);

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2"></div>
          <div className="column">
            <div>
              <span className="title is-3">Фотографии</span>
            </div>
            <br />
            <div className={classNames(style.gallery)}>
              <Upload catId={catId} onComplete={onCompleteUpload} />
              <PhotoList links={links} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Photos.propTypes = {
  catId: PropTypes.number.isRequired,
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function onClose(catId, search) {
  return function() {
    if (search.indexOf('backUrl=description') !== -1) {
      history.push(`/cats/${catId}/edit/description`);
    } else {
      history.push(`/cats/${catId}`);
    }
  }
}

function loadCatPhotos(id, updateHandler) {
  return PhotosApi.getCatPhoto(id)
    .then(links => updateHandler(links))
    .catch(message => {
      notify.error(message || 'Ошибка получения фотографий');
    });
}

function Modal({ children, onClose, max }) {
  const showControls = max > 1;
  const { catId, imageId } = useParams();
  const goTo = (id) => () => history.push(`/cats/${catId}/images/${id}`);
  const next = () => goTo((+imageId + 1) % max)();
  const prev = () => goTo(imageId == 0 ? max - 1 : +imageId - 1)();
  const getDots = () => {
    const dots = [];
    for (let i = 0; i < max; i++) {
      dots.push(
        <div
          className={classNames(style.dot, { [style.dotActive]: i == imageId })}
          onClick={goTo(i)}
        >
          &#9679;
        </div>
      );
    }
    return dots;
  };
  return (
    <div className="modal is-clipped is-active">
      <div
        className="modal-background"
        style={{ cursor: 'zoom-out', backgroundColor: 'rgba(255,255,255,.86)' }}
        onClick={onClose}
      ></div>
      <div className="modal-card">
        <section
          className="modal-card-body"
          style={{ padding: '0', margin: '0', borderRadius: '20px' }}
        >
          {children}
        </section>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        style={{ background: 'lightgray' }}
        onClick={() => onClose()}
      />
      {showControls && (
        <>
          <div onClick={next} className={style.arrowRight}>
            &gt;
          </div>
          <div onClick={prev} className={style.arrowLeft}>
            &lt;
          </div>
          <div className={style.dots}>{getDots()}</div>
        </>
      )}
    </div>
  );
}

export function ImageCarousel() {
  const { catId, imageId } = useParams();
  const { search } = useLocation();
  const [catPhotos, updateCatPhotos] = useState([]);
  useEffect(() => {
    loadCatPhotos(catId, updateCatPhotos);
  }, [catId]);
  return (
    <Modal onClose={onClose(catId, search)} max={catPhotos.length}>
      <div
        className={classNames(style.photoPopup)}
        onClick={onClose(catId, search)}
        style={catPhotos.length !== 0 ? { backgroundImage: `url(${catPhotos[imageId]})` } : {}}
      ></div>
    </Modal>
  );
}

function PhotoList({ links }) {
  const { catId } = useParams();
  const { pathname } = useLocation();
  const backUrl = pathname.indexOf('edit/description') !== -1 ? '?backUrl=description' : '';
  const photos = links.map((link, i) => (
      <Link key={i} to={`/cats/${catId}/images/${i}${backUrl}`}>
        <Photo link={link} />
      </Link>
    )
  );

  return photos;
}
PhotoList.propTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Photo({ link }) {
  return (
    <div
      className={classNames(style.photo)}
      style={{ backgroundImage: `url(${link})` }}
    ></div>
  );
}
Photo.propTypes = {
  link: PropTypes.string.isRequired,
};

function Upload({ catId, onComplete }) {
  const onChange = event => {
    const input = event.target;

    console.log(input.files[0].name.includes(".txt"))
    if (input.files[0].name.includes(".txt")){
      input.value = null
      return
    }

    PhotosApi.uploadCatPhoto(catId, input.files[0])
      .then(({ fileUrl }) => {
        onComplete(fileUrl);
        notify.success('Фотография успешно загружена');
      })
      .catch(message => {
        notify.error(
          message ||
            'Не удалось загрузить изображение. Размер файла больше 5мб или имеет неправильное расширение'
        );
      })
      .finally(() => {
        input.value = null;
      });
  };

  return (
    <div className={classNames(style.photo, style.upload)}>
      <label>
        <span className={classNames(style.title, 'title')}>Добавить фото</span>
        <form>
          <input
            type="file"
            accept="image/png,image/jpeg,.txt"
            onChange={onChange}
          />
        </form>
      </label>
    </div>
  );
}
Upload.propTypes = {
  catId: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};
