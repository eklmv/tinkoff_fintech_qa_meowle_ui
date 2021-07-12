import React from 'react';
import classNames from 'classnames';
import style from '../links-with-networks/links-with-networks.module.css';

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
              <div>
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
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </section>
  );
}
