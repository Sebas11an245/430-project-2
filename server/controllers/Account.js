const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/player' });
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass != pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/player' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occured!' });

    }
};
const appPage = (req, res) => {
  return res.render('app'); // loads app.handlebars
};

const getMe = (req, res) => {
  res.json({
    username: req.session.account.username,
    premium: req.session.account.premium,
    anonymity: req.session.account.anonymity || false,
  });
};

const upgrade = async (req, res) => {
    try {
        // Find the account and update the premium flag
        const account = await Account.findOne({ _id: req.session.account._id });
        account.premium = true;
        await account.save();

        // Update the session so the change is immediate
        req.session.account.premium = true;
        
        return res.json({ message: 'Upgraded successfully', premium: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Upgrade failed' });
    }
}

const downgrade = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.session.account._id });
        account.premium = false;
        await account.save();
        req.session.account.premium = false;
        return res.json({ premium: false });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Downgrade failed' });
    }
}

const changePassword = async (req, res) => {
    const { oldPass, newPass, newPass2 } = req.body;

    if (!oldPass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'New passwords do not match' });
    }

    try {
        const account = await Account.findOne({ _id: req.session.account._id });

        return Account.authenticate(account.username, oldPass, async (err, verifiedAccount) => {
            if (err || !verifiedAccount) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            const hash = await Account.generateHash(newPass);
            account.password = hash;
            await account.save();

            return res.json({ message: 'Password updated successfully!' });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const toggleAnon = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.session.account._id });
        account.anonymity = !account.anonymity;
        await account.save();
        
        // Update session to reflect change
        req.session.account.anonymity = account.anonymity;
        
        return res.json({ anonymity: account.anonymity });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to toggle anonymity' });
    }
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    appPage,
    getMe,
    upgrade,
    downgrade,
    changePassword,
    toggleAnon
};
