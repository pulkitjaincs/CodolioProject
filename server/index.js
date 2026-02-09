import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/database.js';
import apiRoutes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

const startServer = async () => {
    const connected = await connectDB();
    if (!connected) {
        console.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📊 API Base: http://localhost:${PORT}/api`);
    });
};

startServer();
