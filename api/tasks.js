const moment = require("moment");

module.exports = (app) => {
    const getTasks = (req, res) => {
        const date = req.query.date
            ? req.query.date
            : moment().endOf("day").toDate();

        app.db("tasks")
            .where({ userId: req.user.id })
            .where("estimateAt", "<=", date)
            .orderBy("estimateAt")
            .then((tasks) => res.json(tasks))
            .catch((err) => res.status(400).json(err));
    };

    const save = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send("Descrição é obrigatória");
        }

        req.body.userId = req.user.id;

        app.db("tasks")
            .insert(req.body)
            .then(() => res.status(204).send())
            .catch((err) => res.status(400).json(err));
    };

    const remove = (req, res) => {
        app.db("tasks")
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then((rows) => {
                if (rows > 0) {
                    return res.status(204).send();
                } else {
                    return res.status(400).send("Task não encontrada");
                }
            })
            .catch((err) => res.status(400).json(400));
    };

    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db("tasks")
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(() => res.status(204).send())
            .catch((err) => res.status(400).json(err));
    };

    const toggleTask = (req, res) => {
        app.db("tasks")
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then((task) => {
                if (!task) {
                    return res.status(400).send("Task não encontrada");
                }

                const doneAt = task.doneAt ? null : new Date();
                updateTaskDoneAt(req, res, doneAt);
            })
            .catch((err) => res.status(400).json(err));
    };

    return { getTasks, save, remove, toggleTask };
};
