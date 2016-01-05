'use strict';
angular.module('user.client.service', [])

//============================================
// Factory concerning all users
//============================================
.factory('User', function($http) {

	// Create a new object
	var user = {};

    // Get a single user
	user.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// Get all users
	user.all = function() {
		return $http.get('/api/users/');
	};

	// Create a user
	user.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	// Update a user
	user.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

    // Pushes a general object into the current user for bulk additions
	user.push = function(capsule) {
	    return $http({ url:'/api/me', method:'POST', data: capsule});

        /*** Capusle Object
         *  ------------------------------------------------------------------------------
         *  'show_history'  : [{ show, date, seq  }]  -Tracks what show a user watched
         *  'media_history' : [{ show, date, prog }]  -Tracks what media a user watched
         *  'queue'         : [{ show, prio }]        -Shows the user plans to watch
         *   -----------------------------------------------------------------------------
         ***/
	};

	// Delete a user
	user.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

    //============================================
    // Show History
    //
    // pill : { show, date, seq }
    //  - show : show._id - The show watched
    //  - date : Date     - Date last watched
    //  - seq  : Number   - Episode Number
    //============================================

    // Gets array of show pills
    user.get_shows = function(query){
		return $http({ url:'/api/me/show-history', method:'GET', params: query});
    };

    // Pushes pill into media history or updates time if it already exists
    user.push_show = function(pill){
		return $httpt({ url:'/api/me/show-history', method:'POST', data: pill});
    };

    // Deletes show pill from history
    user.delete_show = function(show_name){
		return $http({ url:'/api/me/show-history' + show_name, method:'DELETE'});
    };

    //============================================
    // Media History
    //
    // pill : { media, date, prog }
    //  - media : media._id - The media watched
    //  - date  : Date      - Date last watched
    //  - prog  : Number    - Progress in seconds
    //============================================

    // Gets array of media pills
    user.get_media = function(query){
		return $http({ url:'/api/me/media-history', method:'GET', params: query});
    };

    // Pushes pill into media history or updates time if it already exists
    user.push_media = function(pill){
		return $http({ url:'/api/me/media-history', method:'POST', data: pill});
    };

    // Deletes media pill from history
    user.delete_media = function(media_name){
		return $http({ url:'/api/me/media-history' + media_name, method:'DELETE'});
    };

    //============================================
    // Show Queue
    //
    // pill : { show, prio }
    //  - show : show._id - The show planned
    //  - prio : Number   - Where on the queue
    //============================================

    // Gets array of queue pills
    user.get_queue = function(query){
		return $http({ url:'/api/me/queue', method:'GET', params: query });
    };

    // Pushes pill into our main queue
    user.push_queue = function(pill){
		return $http({ url:'/api/me/queue', method:'POST', data: pill});
    };

    // Deletes media pill from history
    user.delete_queue = function(show_name){
		return $http({ url:'/api/me/queue' + show_name, method:'DELETE'});
    };

	// Return our entire user object
	return user;

});
