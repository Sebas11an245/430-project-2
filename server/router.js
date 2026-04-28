const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/player', mid.requiresLogin, controllers.Account.appPage);

    app.get('/me', mid.requiresLogin, controllers.Account.getMe);
    
    app.post('/submitScore', mid.requiresLogin, controllers.Score.saveScore);
    app.get('/getScores', mid.requiresLogin, controllers.Score.getScores);

    app.post('/upgrade', mid.requiresLogin, controllers.Account.upgrade);
    app.post('/downgrade', mid.requiresLogin, controllers.Account.downgrade);


    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;