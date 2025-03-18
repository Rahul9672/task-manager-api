const Task = require("../models/Task");
const redis = require("redis");
const client = redis.createClient();

const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        if (!title || !priority) {
            return res.status(400).json({ error: "Title and priority are required" });
        }

        const newTask = new Task({ title, description, priority });

        await newTask.save();

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { priority, status, page = 1, limit = 10 } = req.query;
        const cacheKey = `tasks:${priority || "all"}-${status || "all"}-${page}`;

        client.get(cacheKey, async (err, cachedTasks) => {
            if (err) {
                console.error("Redis Error:", err);
            }
            if (cachedTasks) {
                return res.json(JSON.parse(cachedTasks));
            }

            const filter = {};
            if (priority) filter.priority = priority;
            if (status) filter.status = status;

            const tasks = await Task.find(filter)
                .sort({ priority: -1, createdAt: 1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            if (!tasks.length) {
                return res.status(404).json({ message: "No tasks found" });
            }

            client.set(cacheKey, JSON.stringify(tasks), "EX", 300);

            res.json(tasks);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const validPriorities = ["low", "medium", "high"];
        const validStatuses = ["pending", "completed"];

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ error: "Invalid priority value" });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;

        const updatedTask = await task.save();

        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await Task.findByIdAndDelete(id);

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Correctly export functions
module.exports = { createTask, getTasks, updateTask, deleteTask };
