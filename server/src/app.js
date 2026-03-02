const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const path = require('path');
const os = require('os');

const isRender = process.env.RENDER === 'true' || process.env.RENDER_EXTERNAL_URL;
const uploadDir = isRender 
    ? path.join(os.tmpdir(), 'uploads') 
    : path.join(__dirname, '../public/uploads');

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

// Serve Static Files (Images)
app.use('/uploads', express.static(uploadDir));

// Socket.io Setup
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for now, lock down in production
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'PMS Server is running' });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const projectRoutes = require('./routes/project.routes');
const leadRoutes = require('./routes/lead.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Make io available in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/admin', require('./routes/import.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));

module.exports = { app, httpServer, io };
