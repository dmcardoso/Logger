const fs = require('fs');
const path = require('path');
const watch = require('node-watch');
const readCache = require('read-cache');
const WindowsToaster = require('node-notifier').WindowsBalloon;

module.exports = app => {

    const {new_project, update_project} = app.validate.project, {existsOrError} = app.validate.validator;

    const save = async (req, res) => {
        const project = {...req.body.project};

        if (req.params.id) project.id = req.params.id;

        let validate = {};

        try {

            if (!project.id) validate = await new_project(project);
            else validate = await update_project(project);

        } catch (msg) {
            res.status(400).send(msg);
        }

        if (Array.isArray(validate)) res.status(500).send(validate);
        else if (typeof validate === "object") {
            project.created_at = validate.created_at.toLocaleString();

            if (project.id) {
                app.db('projects')
                    .update(project)
                    .where({id: project.id})
                    .then(id => {
                        app.socket.emit('update', project);
                        res.status(204).send();
                    })
                    .catch(err => res.status(500).send(err));
            } else {
                app.db('projects')
                    .insert(project)
                    .then(id => {
                        project.id = id[0];
                        app.socket.emit('update', project);
                        res.status(204).send();
                    })
                    .catch(err => res.status(500).send(err));
            }
        }

    };

    const get = (req, res) => {
        app.db('projects')
            .then(projects => res.json(projects))
            .catch(err => res.status(500).send(err));
    };

    const getById = (req, res) => {
        app.db('projects')
            .where({id: req.params.id})
            .first()
            .then(project => res.json(project))
            .catch(err => res.status(500).send(err));
    };

    const remove = async (req, res) => {
        try {

            const rowsDeleted = await app.db('projects')
                .where({id: req.params.id})
                .del();

            try {
                existsOrError(rowsDeleted, "Projeto não encontrado");
            } catch (msg) {
                res.status(400).send(msg);
            }

            app.socket.emit('delete', req.params.id);
            res.status(204).send(`Projeto ${req.params.id} deletado!`);
        } catch (msg) {
            res.status(500).send(msg);
        }
    };

    const sendNotification = (project, type) => {
        let notifier = new WindowsToaster({
            withFallback: false, // Fallback to Growl or Balloons?
            customPath: void 0 // Relative/Absolute path if you want to use your fork of SnoreToast.exe
        });

        const logType = wichLog(type) === 'path_debug' ? "Debug" : "Erro";

        notifier.notify(
            {
                title: `${logType} em ${project.name}`,
                message: `O projeto ${project.name} que você está depurando possui um novo ${logType}`,
                icon: `${app.path}/assets/icons/128x128.png`, // String. Absolute path to Icon
                sound: true, // Bool | String (as defined by http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx)
                wait: true, // Bool. Wait for User Action against Notification or times out
                id: void 0, // Number. ID to use for closing notification.
                appID: void 0, // String. App.ID and app Name. Defaults to no value, causing SnoreToast text to be visible.
                remove: void 0, // Number. Refer to previously created notification to close.
                install: void 0 // String (path, application, app id).  Creates a shortcut <path> in the start menu which point to the executable <application>, appID used for the notifications.
            },
            function (error, response) {
                // console.log(response);
            }
        );

    };

    this.watcher = undefined;
    this.count = 0;

    const wichLog = type => (type === 'debug') ? "path_debug" : "path_error";

    const open = async (req, res) => {
        if (this.watcher !== undefined) {
            this.watcher.close();
            delete this.watcher;
            this.count = 0;
        }

        const project = await app.db('projects')
            .where({id: req.params.id})
            .first();

        const read = () => {
            readCache(path.resolve(path.resolve(project[wichLog(req.params.type)])), 'utf8')
                .then(contents => {
                    app.socket.emit('log-data', contents.substr(this.count, contents.length).trim());
                    sendNotification(project, req.params.type);
                    this.count = contents.length;
                });
        };

        read();
        this.watcher = watch(path.resolve(project[wichLog(req.params.type)]), (evt, name) => {
            if (evt === "update") {
                read();
            }
        });

        res.status(204).send();

    };

    const clear = async (req, res) => {
        const project = await app.db('projects')
            .where({id: req.params.id})
            .first();

        fs.writeFile(path.resolve(project[wichLog(req.params.type)]), '', (err) => {
            if (err) throw err;
            this.count = 0;
            res.status(204).send();
        });
    };

    return {save, get, getById, remove, open, clear};
};