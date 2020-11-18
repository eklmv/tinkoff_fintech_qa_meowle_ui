import { urls } from '../config';
import { getApiInstance } from '../utils/api';

const api = getApiInstance(urls.reactionApi);

export class ReactionApi {
  /**
   * Добавление лайка имени
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats__catId__like
   * @param {number} catId ID имени кота
   * @param {object} reactions Реакции - объект для установки состояний реакций
   * @param {boolean} reactions.like Лайк - установить/удалить лайк
   * @param {boolean} reactions.dislike Дизлайк - установить/удалить дизлайк
   * @returns {Promise<string>} OK
   */
  static likes(catId, reactions) {
    return api.post(`/cats/${catId}/likes`, reactions);
  }

  /**
   * Рейтинг имен
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_rating
   * @returns {Promise<{likes: Array, dislikes: Array}>} Массив объектов с списоками лайков и дизлайков
   */
  static rating() {
    return api.get(`/cats/rating`);
  }
}
