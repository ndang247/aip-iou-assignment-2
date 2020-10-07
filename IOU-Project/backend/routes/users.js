var db = require("../models");


module.exports = function(app, passport){
    app.get('/api/emails', (req, res, next) => {
        // Get all user emails
        db.sequelize.query('SELECT email FROM "Users"')
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error:' + err));
    })
}