const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const _ = require("lodash")
const humps = require("humps")
const db = require("../db/db")
require('dotenv').config()

function generateJWTforUser(user = {}) {
  return Object.assign({}, user, {
    token: jwt.sign(
      {
        sub: _.pick(user, ["id", "email"]),
      },
      process.env.SECRET_JWT,
      {
        expiresIn: "7d",
      },
    ),
  })
}

class UserController {
  async createUser(ctx) {
    const { body } = ctx.request
    const user = body;
    user.pass = await bcrypt.hash(user.pass, 10)

    ctx.assert(
      _.isObject(body) && body.email && body.pass,
      422,
      "Empty email or password"
    )
    await db("users").insert(humps.decamelizeKeys(user))
    // ctx.body = { user: _.omit(user, ["password"]) } вывод данных
    try {
      ctx.status = 201;
      ctx.body = { msg: "Created" }
    } catch (err) {
      console.error(err);
    }
  }

  async loginUser(ctx) {
    const { body } = ctx.request
    const user = body;
    ctx.assert(
      _.isObject(user) && user.email && user.pass,
      422,
      "Empty email or password"
    )

    let userDB = await db("users")
      .first()
      .where({ email: user.email })

    ctx.assert(
      user,
      401,
      "Is invalid email or password"
    )
    const isValid = await bcrypt.compare(body.pass, userDB.pass)

    ctx.assert(
      isValid,
      401,
      "Error password or email"
    )

    const token = generateJWTforUser(user)
    ctx.cookies.set("email", userDB.email)
    ctx.cookies.set("token", token)
    ctx.body = { token: token.token }
  }

  async authUser(ctx) {
    const token = ctx.header.token || ctx.cookies.get(token); 
    ctx.assert(
      token,
      422,
      "Empty token"
    )   
    jwt.verify(token, process.env.SECRET_JWT);
    try {
      ctx.body = { msg: ctx.cookies.get("email")}
    } catch (err) {
      console.log(err)
    }

  }
}

module.exports = new UserController();
