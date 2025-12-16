const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'klH.75384',
    database: 'todoappd'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});


app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, title });
    });
});


app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    db.query('UPDATE todos SET title = ? WHERE id = ?', [title, id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Updated successfully' });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(5000, () => console.log(`Server running on port 5000`));
