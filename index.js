const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const json = require('koa-json')
const userController = require('./controller/user');
const bodyParser = require('koa-bodyparser');
require('dotenv').config()

const app = new Koa();
const router = new Router();


router.post('/reg', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/auth', userController.authUser)

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser())
// Routes
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log("Koa started");
});


