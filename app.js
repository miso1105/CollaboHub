const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const nunjucks = require('nunjucks');
const { errorHandler, routerNotFound } = require('./src/middlewares/errorHandler');
const cookiParser = require('cookie-parser');

const authRouter = require('./src/routes/auth');
const recruitRouter = require('./src/routes/recruit');
const commentRouter = require('./src/routes/comment');
const projectRouter = require('./src/routes/project');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiParser(process.env.COOKIE_SECRET));

app.get('/', (req, res) => {
    res.send('test');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recruits', recruitRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/projects', projectRouter);

app.use(routerNotFound);
app.use(errorHandler);

module.exports = app;