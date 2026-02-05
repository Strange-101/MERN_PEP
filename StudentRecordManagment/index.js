import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;
const DATA_FILE = 'data.txt';

app.use(express.json());

let students = [];

// Load data from file if it exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    students = JSON.parse(fileData);

    if (!Array.isArray(students)) {
      students = [];
    }
  } catch (err) {
    console.error('Failed to read data file, starting empty:', err);
    students = [];
  }
}

function saveToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

app.get('/', (req, res) => {
  res.send('Welcome to the Student Record Management System');
});

// Create student
app.post('/students', (req, res) => {
  let { id, name, email, age, course } = req.body;

  if (
    id === undefined ||
    name === undefined ||
    email === undefined ||
    age === undefined ||
    course === undefined
  ) {
    return res
      .status(400)
      .send('All fields (id, name, email, age, course) are required');
  }

  id = parseInt(id, 10);
  age = parseInt(age, 10);

  if (Number.isNaN(id) || Number.isNaN(age)) {
    return res.status(400).send('ID and age must be numbers');
  }

  if (students.find(s => s.id === id)) {
    return res.status(400).send('Student with this ID already exists');
  }

  const student = { id, name, email, age, course };
  students.push(student);

  saveToFile();

  res.status(201).json(student);
});

// Get all students
app.get('/students', (req, res) => {
  res.json(students);
});

// Get student by ID
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).send('Student not found');
  }

  res.json(student);
});

// Update student
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).send('Student not found');
  }

  const { name, email, age, course } = req.body;

  if (name !== undefined) student.name = name;
  if (email !== undefined) student.email = email;

  if (age !== undefined) {
    const parsedAge = parseInt(age, 10);
    if (Number.isNaN(parsedAge)) {
      return res.status(400).send('Age must be a number');
    }
    student.age = parsedAge;
  }

  if (course !== undefined) student.course = course;

  saveToFile();

  res.json(student);
});

// Delete student
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).send('Student not found');
  }

  const removed = students.splice(index, 1)[0];

  saveToFile();

  res.json(removed);
});

// Server start
app.listen(port, () => {
  console.log(`🚀 Student Record Management API running at http://localhost:${port}`);
});
