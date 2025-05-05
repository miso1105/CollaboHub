const app = require('./app');
const webSocket = require('./src/config/socket');

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

webSocket(server, app);