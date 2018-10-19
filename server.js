const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const fetch = require('node-fetch');
const secrets = require('./secrets');

const app = new Koa();
const router = new Router();

app.use(bodyparser());

router.get('/callback', async ctx => {
	const { body } = ctx.request;
	const res = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		body: JSON.stringify({
			client_id: secrets.clientID,
			client_secret: secrets.clientSecret,
			code: body.code,
			state: 'asdf',
		}),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}
	});
	const { access_token } = await res.json();
});

router.get('/', ctx => {
	ctx.response.body = `<html><body><a href="https://github.com/login/oauth/authorize?client_id=${secrets.clientID}&redirect_uri=http://localhost:8000/callback&state=asdf">click me</a></body></html>`;
});

app.use(router.routes());

app.listen(8000);
