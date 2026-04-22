const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/app', mid.requiresLogin, controllers.Account.appPage);

    app.post('/submitScore', mid.requiresLogin, controllers.Score.submitScore);
    app.get('/getScores', mid.requiresLogin, controllers.Score.getUserScores);
    app.get('/leaderboard', controllers.Score.getLeaderboard);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;