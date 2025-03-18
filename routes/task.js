const express = require("express");
const router = express.Router();
const taskController = require("../Controllers/Task");



router.post("/create", taskController.createTask);
router.get("/", taskController.getTasks);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);



module.exports = router;
