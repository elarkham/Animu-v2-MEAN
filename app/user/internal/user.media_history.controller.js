'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User     = require('../user.server.model.js');
var Media    = require('../../media/media.server.model.js');
var chalk    = require('chalk');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Push to Media History of User
 */
exports.push = function(req, res) {
    console.log(chalk.blue('Media pushed to User'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume that
    // its being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    //Checks if data even included
    if(!req.body.media_history) {
        error = new Error('No paramater');
        return complete(error, null);
    }

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id, function(err, user) {

        if (!user) {
            var error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        user.push_media(req.body.media_history, error_check);
    });

    function error_check( err ){
        if( err ){
            complete(err, null);
        }
    }

    function complete( err, user ){
        var msg;

        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        user.save( function(err) {
            if (err){
                msg = 'Failed to save new User';
                console.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(user);
            msg = 'Push to ' + user.name + ' was Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });

    }
};

/**
 * Delete from Media History of User
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Media pushed to User'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume that
    // its being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id, function(err, user) {

        if (!user) {
            var error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        user.delete_media(req.params.media_name, error_check);
    });

    function error_check( err ){
        if( err ){
            complete(err, null);
        }
    }

    function complete( err, user ){
        var msg;

        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        user.save( function(err) {
            if (err){
                msg = 'Failed to save new User';
                console.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(user);
            msg = 'Deletion of media from ' + user.name + ' was Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });

    }
};

/**
 *  Get User Media History
 */
exports.get = function(req, res) {
    console.log(chalk.blue('User Media History Requested'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume its
    // being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    // Check the query
    var limit = parseInt(req.query.limit);
    var order = parseInt(req.query.order);

    /*** Query Object Fields
     *
     * 'limit' : Number  -How many to return
     * 'order' : Number  -In Ascending ( 1 ) or Descending ( -1 ) order?
     *
     ****/
    console.log(chalk.yellow('Searching for user with id ' + id));

    if( !limit ) limit = 10;
    if( !order ) order = -1;

    User.aggregate([
        { "$match"   : { _id: ObjectId(id) }},
        { "$unwind"  : "$media_history" },
        { "$project" : { media : "$media_history.media",
                         prog  : "$media_history.prog",
                         date  : "$media_history.date"
        } },
        { "$sort"    : { "date" : order } },
        { "$limit"   : limit }
    ])
    .exec(function(err, media_history){
        Media.populate(media_history, {path: "media"}, complete);
    });

    function complete( err, media_history ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Search was Successfull!';
        console.log( chalk.green( msg ) );
        return res.json( media_history );
    }

};


