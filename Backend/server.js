require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const patientRoutes = require('./routes/patientRoutes');
const gameSessionRoutes = require('./routes/gameSessionRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const syncRoutes = require('./routes/syncRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const reminiscenceRoutes = require('./routes/reminiscenceRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // higher limit to allow base64 photo uploads for the Memory Vault

connectDB();

// Simple health check — useful to confirm the deployed server is alive
app.get('/', (req, res) => res.json({ status: 'ReMind API is running' }));

app.use('/api', patientRoutes);
app.use('/api', gameSessionRoutes);
app.use('/api', reminderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', syncRoutes);
app.use('/api', memoryRoutes);
app.use('/api', reminiscenceRoutes);

// Catches any error thrown/rejected inside a controller — must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ReMind backend running on port ${PORT}`));
