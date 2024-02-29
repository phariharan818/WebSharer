import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'

// To install msal-node-wrapper, run:
// npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main
import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
    auth: {
        clientId: "415cde75-c8b7-4356-9c31-df9562579604",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "W.G8Q~fm~vgaFnKACA1KCMlCRxZxeWpgKBwGRcS.",
        redirectUri: "https://a4-websharer.express-demo.me/redirect" //"https://websharer-a4-phariha.azurewebsites.net/redirect", //"localhost:3000/redirect" or "examplesite.me/redirect"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};

import apiv1Router from './routes/api/v1/api_v1.js'
import apiv2Router from './routes/api/v2/apiv2.js'
import apiv3Router from './routes/api/v3/apiv3.js'
import models from './models.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "0aba862a-6a5f-4841-9289-c403e125cfc9",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
    req.models = models
    // console.log("session info:", req.session)
    next();
})

app.use('/api/v1', apiv1Router)
app.use('/api/v2', apiv2Router)
app.use('/api/v3', apiv3Router)

app.get('/signin', (req, res, next) => {
	return req.authContext.login({
		postLoginRedirectUri: "/",
	})
    (req, res, next);
});

app.get( '/signout', (req, res, next) => {
	return req.authContext.logout({
		postLogoutRedirectUri: "/", // redirect here after logout
	})
    (req, res, next);
});

app.use(authProvider.interactionErrorHandler());

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})

export default app;
