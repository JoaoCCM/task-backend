module.exports = (app) => {
    app.post("/signup", app.api.user.save);
    app.post("/signin", app.api.auth.signin);

    app.route("/task")
        .all(app.config.passport.authenticate())
        .get(app.api.tasks.getTasks)
        .post(app.api.tasks.save);

    app.route("/task/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.tasks.remove);

    app.route("/task/:id/toggle/")
        .all(app.config.passport.authenticate())
        .put(app.api.tasks.toggleTask);
};
