const path = require('path')
const fs = require('fs')
const https = require('https')
const express = require('express');
const cookieParser = require('cookie-parser');

const app = createApp();

const certOptions = {
	key: fs.readFileSync(path.resolve('../../local-https/localhost-development-2.io.key')),
	cert: fs.readFileSync(path.resolve('../../local-https/localhost-development-2.io.crt')),
}

const port = 444;

https
	.createServer(certOptions, app)
	.listen(port, () => {
		console.log(`Cookies application listening at https://www.localhost-development-2.io:${port}`)
	});

function createApp() {
	const app = express();
	app.use(cookieParser())
	app.use(noCache);

	app.get('/cookies', (req, res) => {
		res.send(`
<html>
	<body>
		Cookies: ${JSON.stringify(req.cookies)}
		<ul>
			<li>
				<a href="/strict-cookie">Create cookie with SameSite=strict</a>
			</li>
			<li>
				<a href="/lax-cookie">Create cookie with SameSite=lax</a>
			</li>
			<li>
				<a href="/none-cookie">Create a cookie with SameSite=none</a>
			</li>
		</ul>
	</body>
</html>
	`);
	});

	app.get('/strict-cookie', cookieHandler('strict'));
	app.get('/lax-cookie', cookieHandler('lax'));
	app.get('/none-cookie', cookieHandler('none'));

	return app;
}

function cookieHandler(sameSite) {
	return (req, res) => {
		const name = `sameSite_${sameSite}_cookie`;
		const value = `I am ${sameSite}`;
		const options = {
			sameSite,
			httpOnly: true,
			secure: true,
		};
		res.cookie(name, value, options);
		res.send(`
<html>
	<body>
		<p>
			Cookie was created:<br>
			name: ${name}<br>
			value: ${value}<br>
			options: ${JSON.stringify(options)}<br>
		</p>
		<p>
			<a href="/cookies">Back</a>
		</p>
	</body>
</html>
	`);
	}
}

function noCache(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
}
