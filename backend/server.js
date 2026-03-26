const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/schedules', scheduleRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Student CRUD API (Neo4j)' });
});

const PORT = process.env.PORT || 5001;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();