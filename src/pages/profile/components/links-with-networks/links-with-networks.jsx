import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import style from '../links-with-networks/links-with-networks.module.css';
import css from '../../../main/main.module.css';
import { Icon } from '../../../../common/components/icon/icon';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

function copuUrl() {
  const el = document.createElement('textarea');
  el.value = window.location.href;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  document.getElementById('button-text').innerText = 'Скопировано';

  const newIcon = <Icon icon={faLock} elementId={'icon'} />;
  ReactDOM.render(newIcon, document.getElementById('icon'));
}

export function LinksWithNetworks({}) {
  const url = window.location.href;
  const imageSize = 25;

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2" />
          <div className="column">
            <div>
              <span className={classNames('title', style['title'])}>
                Поделиться:
              </span>
              <div className={style['links-container']}>
                <a
                  href={'https://vk.com/share.php?url=' + url}
                  className={style['link']}
                >
                  <img src="/img/networks/vk.png" alt="ВК" width={imageSize} />
                </a>
                <a
                  href={'https://www.facebook.com/sharer/sharer.php?u=' + url}
                  className={style['link']}
                >
                  <img
                    src="/img/networks/facebook.png"
                    alt="Facebook"
                    width={imageSize}
                  />
                </a>
                <a
                  href={'https://connect.ok.ru/offer?url=' + url}
                  className={style['link']}
                >
                  <img
                    src="/img/networks/odnoklassniki.png"
                    alt="Одноклассники"
                    width={imageSize}
                  />
                </a>
                <a
                  href={'http://www.twitter.com/share?url=' + url}
                  className={style['link']}
                >
                  <img
                    src="/img/networks/twitter.png"
                    alt="Twitter"
                    width={imageSize}
                  />
                </a>
                <a
                  href={
                    'viber://forward?text=Ищешь имя для любимого котика? Смотри, что нашел!' +
                    url
                  }
                  className={style['link']}
                >
                  <img
                    src="/img/networks/viber.png"
                    alt="Viber"
                    width={imageSize}
                  />
                </a>
                <a
                  href={
                    'https://api.whatsapp.com/send?phone=&text=Ищешь имя для любимого котика? Смотри, что нашел! ' +
                    url
                  }
                  data-action="share/whatsapp/share"
                  className={style['link']}
                >
                  <img
                    src="/img/networks/WhatsApp.png"
                    alt="WhatsApp"
                    width={imageSize}
                  />
                </a>
                <button
                  onClick={copuUrl}
                  className={classNames(
                    'button',
                    'is-light',
                    css.button,
                    style['copy-button']
                  )}
                  type="submit"
                >
                  <Icon icon={faUnlock} elementId={'icon'} />
                  <span id="button-text">Скопировать</span>
                </button>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </section>
  );
}
