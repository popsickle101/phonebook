const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001

const cors = require('cors')

app.use(cors())
app.use(express.static("./dist/"));

let persons = [
    { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
    { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
    { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
    { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
];

app.use(express.json());

// Configure morgan 
morgan.token('post-data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const len = persons.length;
    const time = new Date().toISOString();
    res.send(`Phonebook has info for ${len} people<br/>${time}`);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const personIndex = persons.findIndex(p => p.id === id);
    if (personIndex !== -1) {
        persons = persons.filter(p => p.id !== id);
        res.status(204).end();
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    // Validate that both name and number are provided
    if (!name || !number) {
        return res.status(400).send({ error: 'Name or number is missing' });
    }

    // Check if the name already exists in the phonebook
    const nameExists = persons.some(person => person.name === name);
    if (nameExists) {
        return res.status(400).send({ error: 'Name must be unique' });
    }

    // Generate a unique ID for the new person
    const id = Math.floor(Math.random() * 1000000).toString();
    const newPerson = { id, name, number };

    // Add the new person to the phonebook
    persons = persons.concat(newPerson);
    res.json(newPerson);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
