FlowRouter.route('/video/:postId', {
    // do some action for this route
    action: function(params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },

    name: "<name for the route>" // optional
});

FlowRouter.route('/', {
    // do some action for this route
    action: function(params, queryParams) {
        console.log("video action");
    },

    name: "<name for the route>" // optional
});
