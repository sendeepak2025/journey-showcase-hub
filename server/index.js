const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');
const authRoute = require('./routes/authRoute');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoute);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
