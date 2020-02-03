const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const { apiUri } = require('./configs')
const proxy = require('./proxy')(apiUri)
const cookieParser = require('cookie-parser')
const {
  getRules,
  searchCatsWithApi,
  showFailPage,
  saveCatDescription,
  searchNameDetails,
  addCats,
  getAllCats,
  searchCatsByPatternWithApi,
  getPhotos,
  getVersions,
  createRenderDetails,
  setLike,
  deleteLike,
  setDislike,
  deleteDislike,
  getTopNames,
  getAntiTopNames,
  successNotification,
  failNotification,
} = require('./services')
const pino = require('express-pino-logger')()

function createApp() {
  const app = express()

  app.use(pino)

  app.set('view engine', 'pug')

  app.use(express.static('public'))
  app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  app.use(proxy.init())
  app.use(cookieParser())

  app.get('/', function(req, res) {
    getRules()
      .then(rules =>
        res.render('index', {
          showSuccessPopup: req.cookies.showSuccessPopup,
          showFailPopup: req.cookies.showFailPopup,
          popupMessage: req.cookies.popupMessage,
          popupFailMessage: req.cookies.popupFailMessage,
          validationRules: rules,
        })
      )
      .catch(err => {
        req.log.error(err.message)
        showFailPage(res)
      })
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search', function(req, res) {
    const searchParams = {
      needle: req.query.needle,
      gender: req.query.gender,
    }

    Promise.all([searchCatsWithApi(searchParams, res), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, { ...context, validationRules })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод вывода всех котов
  */
  app.get('/all-names', function(req, res) {
    const filter = { order: req.query.order, gender: req.query.gender }

    Promise.all([getAllCats(filter), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, {
          ...context,
          validationRules,
          order: filter.order || 'none',
          gender: filter.gender,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search-suggests', function(req, res) {
    if (!req.query.name) {
      return res.json([])
    }

    const limit = req.query.limit || 20

    searchCatsByPatternWithApi(req.query.name, limit)
      .then(result => {
        res.json(result)
      })
      .catch(err => req.log.error(err.message))
  })

  /*
  Показ диалогового окна добавления имен
  */
  app.get('/cats/add', function(req, res) {
    getRules()
      .then(validationRules => {
        res.render('add', {
          validationRules,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод добавления котов
  */
  app.post('/cats/add', function(req, res) {
    const cats = {}

    for (const [catParam, value] of Object.entries(req.body)) {
      const catNameMatch = catParam.match(/^cat-name-(\d+)$/)
      if (catNameMatch) {
        const catIndex = catNameMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].name = value.trim()
        continue
      }

      const catGenderMatch = catParam.match(/^cat-gender-(\d+)$/)
      if (catGenderMatch) {
        const catIndex = catGenderMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].gender = value.trim()
        continue
      }
    }

    const catsToAdd = Object.values(cats)

    addCats(catsToAdd, res)
      .then(() => {
        successNotification(null, res)
        res.redirect("/")
      })
      .catch(err => showFailPage(res, err.message ))
  })

  /*
  Метод получения кота по ID
  */
  app.get('/cats/:catId', function(req, res) {
    const { catId } = req.params
    Promise.all([searchNameDetails(catId), getRules(), getPhotos(catId)])
      .then(([cat, validationRules, photos]) => {
        const {
          cat: { name, description, gender, id, likes, dislikes },
        } = cat
        const images = photos.images

        res.render('name-details', {
          name,
          description,
          gender,
          id,
          validationRules,
          photos: images,
          likes,
          liked: req.cookies['liked'] === 'true',
          dislikes,
          disliked: req.cookies['disliked'] === 'true',
        })
      })
      .catch(() => showFailPage(res))
  })

  /* Метод установки лайка */
  app.post('/cats/:catId/like', function(req, res) {
    const { catId } = req.params

    // Если у клиента есть кука лайка с значением 'true' - он не может лайкнуть еще раз - отправляем ошибку
    if (req.cookies.liked === 'true') {
      console.log(`${catId} already liked`)
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему лайк
    setLike(catId)
      .then(() => {
        res.cookie('liked', 'true', {
          expires: new Date(2030, 1, 1),
          path: `/cats/${catId}`,
        })
        res.redirect('back')
      })
      .catch(err => {
        console.log('Error: like', err)
        return showFailPage(res)
      })
  })

  /* Метод удаения лайка */
  app.post('/cats/:catId/unlike', function(req, res) {
    const { catId } = req.params

    // Если у клиента нет куки лайка с значением 'true' - он не может отменить лайк - отправляем ошибку
    if (req.cookies.liked !== 'true') {
      console.log(`Error: ${catId} unlike without cookie`)
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему лайк
    deleteLike(catId)
      .then(() => {
        res.cookie('liked', 'false', {
          maxAge: 0,
          path: `/cats/${catId}`,
        })
        res.redirect('back')
      })
      .catch(err => {
        console.log('Error: unlike', err)
        return showFailPage(res)
      })
  })

  /* Метод установки дизлайка */
  app.post('/cats/:catId/dislike', function(req, res) {
    const { catId } = req.params

    // Если у клиента есть кука дизлайка с значением 'true' - он не может дизлайкнуть еще раз - отправляем ошибку
    if (req.cookies.disliked === 'true') {
      console.log(`${catId} already disliked`)
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему дизлайк
    setDislike(catId)
      .then(() => {
        res.cookie('disliked', 'true', {
          expires: new Date(2030, 1, 1),
          path: `/cats/${catId}`,
        })
        res.redirect('back')
      })
      .catch(err => {
        console.log('Error: dislike', err)
        return showFailPage(res)
      })
  })

  /* Метод удаения дизлайка */
  app.post('/cats/:catId/undislike', function(req, res) {
    const { catId } = req.params

    // Если у клиента нет куки лайка с значением 'true' - он не может отменить лайк - отправляем ошибку
    if (req.cookies.disliked !== 'true') {
      console.log(`Error: ${catId} undislike without cookie`)
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему дизлайк
    deleteDislike(catId)
      .then(() => {
        res.cookie('disliked', 'false', {
          maxAge: 0,
          path: `/cats/${catId}`,
        })
        res.redirect('back')
      })
      .catch(err => {
        console.log('Error: undislike', err)
        return showFailPage(res)
      })
  })

  /*
  Метод вызова редактирования кота
  */
  app.get('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    searchNameDetails(catId)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details-edit', {
          name,
          description,
          id,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод сохранения модицификации кота
  */
  app.post('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    const { description } = req.body

    saveCatDescription(catId, description)
      .then(() => {
        res.redirect(`/cats/${catId}`)
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод получения версий сервисов
  */
  app.get('/versions', function(req, res) {
    getVersions()
      .then(result => {
        res.json(result)
      })
  })

  app.get('/top-names', function(req, res) {
    Promise.all([getTopNames(), getRules()])
      .then(([namesList, validationRules]) => {
        res.render('top-names', {
          validationRules,
          namesList,
        })
      })
      .catch(() => showFailPage(res))
  })

  app.get('/anti-top-names', function(req, res) {
    Promise.all([getAntiTopNames(), getRules()])
      .then(([namesList, validationRules]) => {
        res.render('anti-top-names', {
          validationRules,
          namesList,
        })
      })
      .catch(() => showFailPage(res))
  })

  proxy.post('/cats/:catId/upload', true, function(proxyRes, req, res) {
    proxyRes.on('data', () => {})

    proxyRes.on('end', function() {
      res.redirect('back')
    })
  })

  proxy.get('/photos', false)

  return app
}

module.exports = {
  createApp,
}
