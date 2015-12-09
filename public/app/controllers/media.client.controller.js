'use strict';
angular.module('media.client.controller', ['media.client.service'])

.controller('mediaController', function(Media) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;
    vm.perPage = 30;
    vm.query = "";

	// grab all the media at page load
	Media.all()
		.success(function(data) {

			vm.processing = false;

			vm.media = data;
		});

	// function to delete a media
	vm.deleteMedia = function(name) {
		vm.processing = true;

		Media.delete(name)
			.success(function(data) {

				// get all media to update the table
				// you can also set up your api
				// to return the list of media with the delete call
				Media.all()
					.success(function(data) {
						vm.processing = false;
						vm.media = data;
					});

			});
	};

})

// controller applied to media creation page
.controller('mediaCreateController', function(Media) {

	var vm = this;

	// variable to hnamee/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a media
	vm.saveMedia = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the mediaService
		Media.create(vm.mediaData)
			.success(function(data) {
				vm.processing = false;
				vm.message = data.message;
			});

	};

})

// controller applied to media edit page
.controller('mediaEditController', function($routeParams, Media) {

	var vm = this;

	// variable to hnamee/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the media data for the media you want to edit
	// $routeParams is the way we grab data from the URL
	Media.get($routeParams.media_name)
		.success(function(data) {
			vm.mediaData = data;
		});

	// function to save the media
	vm.saveMedia = function() {
		vm.processing = true;
		vm.message = '';

		// call the mediaService function to update
		Media.update($routeParams.media_name, vm.mediaData)
			.success(function(data) {
				vm.processing = false;

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

})

// controller applied to media profile page
.controller('mediaProfileController', function($routeParams, Media) {

    var vm = this;

    vm.media_name = $routeParams.media_name;

	// get the media data for the media you want to edit
	// $routeParams is the way we grab data from the URL
	Media.get($routeParams.media_name)
		.success(function(data) {
			vm.mediaData = data;
            vm.path = 'assets/video/' + data.show.path +'/' + data.path;

            vm.config = {
                sources:[
                    {src: vm.path, type: "video/mp4"}
                ],
                theme: 'assets/libs/videogular-themes-default/videogular.css',
            }
	    });
})


