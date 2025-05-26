const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const nunjucks = require('nunjucks');
const { errorHandler, routerNotFound } = require('./src/middlewares/errorHandler');
const cookiParser = require('cookie-parser');
const path = require('path');

const authRouter = require('./src/routes/auth');
const recruitRouter = require('./src/routes/recruit');
const commentRouter = require('./src/routes/comment');
const projectRouter = require('./src/routes/project');
const projectInvitesRouter = require('./src/routes/projectInvites');
const taskRouter = require('./src/routes/task');
const projectChatRouter = require('./src/routes/projectChat');
const viewsRouter = require('./src/routes/viewsRouter');
const { csrfProtection } = require('./src/middlewares/authMiddleware');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
    res.send('test');
});

if (process.env.NODE_ENV === 'production') {
app.use((req, res, next) => {
        const publicRoutes = [
            '/api/v1/auth/login',
            '/api/v1/auth/join'
        ];
        
        if (publicRoutes.some(path => req.path.startsWith(path))) {
            return next();                // 로그인, 회원가입 라우터는 CSRF 검증 안함
        }

        csrfProtection(req, res, next);   // 그 외는 검증
    });
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recruits', recruitRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/project-invites', projectInvitesRouter);
app.use('/api/v1/projects/:projectId/tasks', taskRouter);
app.use('/api/v1/projects/:projectId/chats', projectChatRouter);
app.use('/', viewsRouter);

app.use(routerNotFound);
app.use(errorHandler);

module.exports = app;