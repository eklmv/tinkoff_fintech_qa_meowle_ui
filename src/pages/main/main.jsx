import React from 'react';
import history from '../../utils/history';
import { CatLogo } from '../../common/components/cat-logo';
import css from './main.module.css';
import classNames from 'classnames/bind';
import {
  faSearch,
  faStarHalfAlt,
  faPlus,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from '../../common/components/icon/icon';
import { ValidationsContext } from '../../common/contexts/validations';
import { Suggestions } from '../../common/components/suggestions/suggestions';
import { getErrorValidation } from '../../utils/validation';
import { notify } from '../../utils/notifications/notifications';
import { TrickyCat } from './tricky-cat';

class MainPageWithoutRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      some: 2,
      showCatHands: false,
      catClick: null,
      catLogo: 'default',
    };
    this.style = classNames.bind(css);
    this.inputRef = React.createRef();
  }

  // Template methods

  get isSearchButtonDisabled() {
    return !this.state.searchName;
  }

  get buttons() {
    const className = classNames('button', 'is-light', css.button);
    return (
      <>
        <button
          className={className}
          type="submit"
          disabled={this.isSearchButtonDisabled}
        >
          <Icon icon={faSearch} />
          <span>Найти имя коту</span>
        </button>
        <Link to="/all-names" className={className}>
          <Icon icon={faBars} />
          <span>Все имена</span>
        </Link>
        <Link to="/rating" className={className}>
          <Icon icon={faStarHalfAlt} />
          <span>Рейтинг имён</span>
        </Link>
      </>
    );
  }

  onChange = event => {
    const newValue = event.target.value;
    notify.warning(newValue);
    const error = getErrorValidation(newValue, this.context);

    if (error) {
      notify.warning(error);

      return;
    }
    this.setState({ searchName: newValue });
  };

  onSubmit = event => {
    event.preventDefault();

    this._search();
  };

  onSelectSuggestion = suggestion => {
    this.setState({ searchName: suggestion });
  };

  clickOnCatLogo = () => {
    this.setState({ catClick: Date.now() });
  };

  // Private methods

  _search() {
    if (!this.state.searchName) return;

    history.push(`/search/${this.state.searchName}`);
  }

  render() {
    return (
      <>
        <section className={this.style('section', 'full-size')}>
          <div className={this.style('container', 'full-size')}>
            <div
              className={this.style(
                'columns',
                'is-flex-mobile',
                'is-centered',
                'is-vcentered',
                'full-size'
              )}
            >
              <form onSubmit={this.onSubmit} className="column is-8">
                <div className={this.style('columns', 'is-mobile', 'header')}>
                  <div className="column" style={{ zIndex: 3 }}>
                    <h1
                      className={this.style(
                        'is-size-1-mobile',
                        'is-vbottom-mobile',
                        'title'
                      )}
                      data-autotest-id="title"
                    >
                      meowle
                    </h1>
                  </div>
                  <div className={classNames('column', css.catLogoContainer)}>
                    <CatLogo
                      size="l"
                      catType={this.state.catLogo}
                      onClick={this.clickOnCatLogo}
                    ></CatLogo>
                    <TrickyCat
                      catClick={this.state.catClick}
                      changeCatImage={() =>
                        this.setState({ catLogo: 'tricky' })
                      }
                    ></TrickyCat>
                  </div>
                </div>
                <div>
                  <div className="field">
                    <div className="control" style={{ zIndex: 4 }}>
                      <Suggestions
                        onSelect={this.onSelectSuggestion}
                        inputRef={this.inputRef}
                        inputValue={this.state.searchName}
                      >
                        <input
                          type="text"
                          className="input"
                          placeholder="Введите часть имени"
                          autoComplete="off"
                          ref={this.inputRef}
                          disabled={!this.context}
                          value={this.state.searchName}
                          onChange={this.onChange}
                        />
                      </Suggestions>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control has-text-centered">
                      {this.buttons}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <LinkToAdd />
      </>
    );
  }
}

MainPageWithoutRoute.contextType = ValidationsContext;

export const MainPage = withRouter(MainPageWithoutRoute);

function LinkToAdd() {
  return (
    <Link
      className="button is-light has-background-warning show-add-names"
      to="/cats/add"
      style={{ position: 'absolute', right: '20px', bottom: '20px' }}
    >
      <Icon icon={faPlus} />
    </Link>
  );
}
