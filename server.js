const mongoose = require('mongoose');
const express = require('express');
const app = express();

const port = 3000;

mongoose.connect('mongodb+srv://Ahmed:dKZ1iTyQ4XMqQtki@assignment.c5whbpp.mongodb.net/students_doctors?retryWrites=true&w=majority&appName=Assignment',)
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas', error);
});

app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  level: String,
  address: String
});


const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String
});


const Student = mongoose.model('Student', studentSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);


app.post('/add-student-hardcoded', async (req, res) => {
  const newStudent = new Student({
    name: 'Ahmed',
    age: 20,
    level: 'Level 3',
    address: 'Cairo'
  });

  await newStudent.save();
  res.status(201).json({ message: 'Hardcoded student added', student: newStudent });
});


app.post('/add-student', async (req, res) => {
  const { name, age, level, address } = req.body;
  const newStudent = new Student({ name, age, level, address });

  await newStudent.save();
  res.status(201).json({ message: 'Student added from body', student: newStudent });
});


app.post('/add-doctor', async (req, res) => {
  const { name, age, phone } = req.query;
  if (!name || !age || !phone) {
    return res.status(400).json({ error: 'Missing doctor data in query params' });
  }

  const newDoctor = new Doctor({ name, age, phone });
  await newDoctor.save();
  res.status(201).json({ message: 'Doctor added from query', doctor: newDoctor });
});


app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
});


app.delete('/delete-student/:id', async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Student not found' });
  res.status(200).json({ message: 'Student deleted', deleted });
});


app.put('/update-doctor-name', async (req, res) => {
  const { oldName, newName } = req.query;

  if (!oldName || !newName) {
    return res.status(400).json({ error: 'Both oldName and newName are required' });
  }

  const updated = await Doctor.findOneAndUpdate(
    { name: oldName },
    { name: newName },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  res.status(200).json({ message: 'Doctor name updated successfully', updated });
});


app.get('/all', async (req, res) => {
  const students = await Student.find();
  const doctors = await Doctor.find();
  res.status(200).json({ students, doctors });
});


app.get('/doctors', async (req, res) => {
  const doctors = await Doctor.find();
  res.status(200).json(doctors);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
