const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ROOT",
    database: "employee"
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error in DB connection', err);
    }
    else {
        console.log("dB is Connected")
    }
})

//Create a table

mysqlConnection.query(
    "CREATE TABLE IF NOT EXISTS users ( emp_id INT AUTO_INCREMENT PRIMARY KEY, emp_name VARCHAR(40) NOT NULL, salary INT )",
    (err) => {
        if (err) {
            console.error("error creating table:", err)
        }
        else {
            console.log("Table is created")
        }
    },
    //Reset  the auto increment valuefor emp_id to 1
    mysqlConnection.query("ALTER TABLE users AUTO_INCREMENT=1", (err) => {
        if (err) {
            console.error("Error resetting Auto_INCREMENT:", err);
        }
        else {
            console.log("AUTO_INCREMENT reset succesfully");
        }
    })
);
//POST api to insert into table

app.post("/employee", (req, res) => {
    const { emp_name, salary } = req.body;

    mysqlConnection.query(
        "INSERT INTO users (emp_name,salary) VALUES(?,?)",
        [emp_name, salary],
        (err) => {
            if (err) {
                console.error("Error inserting data", err);
                res.status(500).send("Interbal server error");
            }
            else {
                console.log("Data sucessfully inserted");
                res.status(201).send("user register");
            }
        }
    );
});

//GET

app.get("/employee", (req, res) => {
    mysqlConnection.query(
        "SELECT * FROM users",
        (err, results) => {
            if (err) {
                console.log("Error getting data:", err);
                res.status(500).send("Error getting data");
            } else {
                console.table(results);
                res.status(200).json(results);
            }
        }
    );
});

//delete
app.delete("/delete", (req, res) => {
    const { emp_id } = req.body;
    mysqlConnection.query(
        "DELETE from users where emp_id=?",
        [emp_id],
        (err, results) => {
            if (err) {
                console.log("Id is not found", err);
                res.status(500).send("Id is not found ");
            }
            else {
                console.log("Data deleted succesfully");
                res.status(200).send("data deleted");
            }
        }
    )
})
//Update 

app.put('/employee', (req, res) => {
    const emp_id = req.body.emp_id;
    const { emp_name, salary } = req.body;
    mysqlConnection.query(
        "UPDATE users SET emp_name = ?, salary = ? WHERE emp_id = ?",
        [emp_name, salary, emp_id],
        (err, results) => {
            if (err) {
                console.error("Error updating user:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("User updated successfully");
                res.status(200).send("User updated successfully");
            }
        }
    )
})
app.listen(2000, () => console.log('server is running '))