const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    app.use(cors());
    app.use(express.json());

    app.use('/api/users', userRoutes);
    app.use('/api/expenses', expenseRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/incomes', incomeRoutes);

    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
