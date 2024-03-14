const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const port = 4000;

const app = express();

// create a connection with database
const connection = mysql.createConnection({
	user: "sql8691388",
	host: "sql8.freesqldatabase.com",
	database: "sql8691388",
	password: "bvIXPUqWy1",
	port: 3306,
});

connection.connect((err) => {
	err
		? console.log(err.message)
		: console.log(`the database is connected with your app...`);
});

// middlware to make use the json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// to create the task table in the data base at frist in the route of /.
app.get("/", (req, res) => {
	// create table in the database
	const taskTable = `
	  CREATE TABLE IF NOT EXISTS Task (
		id INT NOT NULL AUTO_INCREMENT,
		task_name VARCHAR(255),
		completed BOOLEAN DEFAULT false,
		time_zone VARCHAR(255) DEFAULT 'NOT_SETED',
		PRIMARY KEY (id)
	  )
	`;
	connection.query(taskTable, (err, result) => {
	  err
		? res.send(err.message)
		: res.send(
			`Welcome!! server is running and listening...\nTask created`
		  );
	});
  });

// to insert a data on the task table in the data base  in the route of /task/create.
app.post("/task/create", (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.send(`name is required`);
	}

	const createTask = `INSERT INTO Task (task_name) VALUES ('${name}')`;

	connection.query(createTask, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			return res.end("task is inserted to DB!!");
		}
	});
});

// TO READ All DATA FROM DATABASE.
app.get("/task", (req, res) => {
	const Readalltasks = `SELECT *FROM Task ORDER BY id DESC `;

	connection.query(Readalltasks, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			return res.json({ task: result });
		}
	});
});

// to read a single task from database
app.get("/task/:id", (req, res) => {
	// const { id } = req.params;
	// console.log(id);
	const id = spiltid(`'${req.url}'`);

	console.log(id);
	const Readtask = `SELECT * FROM Task WHERE id = '${id}' `;

	connection.query(Readtask, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			if (result.length) {
				return res.json(result);
			} else {
				return res.send(`No task with this Id. Id=${id}`);
			}
		}
	});
});

// update atask by id
app.patch("/task/:id", (req, res) => {
	let { name, completed, time } = req.body;
	// const { id } = req.params;
	// console.log(id);
	const id = spiltid(`'${req.url}'`);
	console.log(id);

	if (!name) {
		return res.send("name is required!!!");
	}

	if (completed) {
		completed = 1;
	} else {
		completed = 0;
	}

	const Updatetask = ` UPDATE Task
	SET task_name = "${name}",
		completed = ${completed},
		time_zone= '${time}'
		WHERE id=${id}`;

	connection.query(Updatetask, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			if (result.affectedRows) {
				return res.send(`task with id ${id} is updated`);
			} else {
				return res.send(`No task with this Id. Id=${id}`);
			}
		}
	});
});

// delete a task by id
app.delete("/task/:id", (req, res) => {
	// const id = spiltid(`${req.url}`);
	const { id } = req.params;
	console.log(id);
	console.log(id);

	const Deletetask = ` DELETE FROM Task WHERE id=${id}`;

	connection.query(Deletetask, (err, result) => {
		if (err) {
			return res.send(err.message);
		} else {
			if (result.affectedRows) {
				return res.send(`task with id ${id} is deleted`);
			} else {
				return res.send(`No task exsists with Id ${id}`);
			}
		}
	});
});

// listening port to express server config...
app.listen(port, (err) => {
	err
		? console.log(err.message)
		: console.log(
				`server is listening on port ${port}. to use go http://localhost:${port}/ `
		  );
});

// function to get the id from req.url
const spiltid = (word) => {
	newid = "";
	for (let index = 0; index < word.length; index++) {
		const element = word[index];
		if (!isNaN(element)) {
			newid += element;
		}
	}
	return newid;
};

// console.log(spiltid(`/task/3`))
