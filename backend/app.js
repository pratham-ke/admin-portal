const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes); 