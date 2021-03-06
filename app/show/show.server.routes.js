'use strict';
var show = require('./show.server.controller.js');

module.exports = function( app, express ) {
    var showRouter = express.Router();

    showRouter.route('/shows')

    // on routes that end in /shows
    // ----------------------------------------------------
        .post(show.create)

        .get(show.query);

    // on routes that end in /shows/:show_name
    // ----------------------------------------------------
    showRouter.route('/shows/:show_name')

        .get(show.read)

        .put(show.update)

        .delete(show.delete);

    return showRouter;
};
