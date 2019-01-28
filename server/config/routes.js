const routes = {
    projects: '/projects',
    projectDebug: '/projects/:id/:type',
    projectsParam: '/projects/:id'
};


module.exports = app => {

    app.route(routes.projectDebug)
        .get(app.api.project.open)
        .post(app.api.project.clear);

    app.route(routes.projects)
        .post(app.api.project.save)
        .get(app.api.project.get);

    app.route(routes.projectsParam)
        .put(app.api.project.save)
        .delete(app.api.project.remove)
        .get(app.api.project.getById);

};