const path = require('path')
const fs = require('fs')
const https = require('https')
const express = require('express');

const app = express();
app.get('/', (req, res) => {
	res.send(`
<html>
	<head>
		<style type="text/css">
		iframe {
			width: 1024px;
			height: 768px;
		}
		</style>
	</head>
	<body>
		<iframe src="https://localhost-development-2.io:444/cookies"/>
	</body>
</html>
	`);
});

const certOptions = {
	key: fs.readFileSync(path.resolve('../../local-https/localhost-development-1.io.key')),
	cert: fs.readFileSync(path.resolve('../../local-https/localhost-development-1.io.crt')),
}

https
	.createServer(certOptions, app)
	.listen(443, () => {
		console.log(`Cookies application listening at https://localhost-development-1.io`)
	});
