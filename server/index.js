const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');
const authRoute = require('./routes/authRoute');
const imageRoute = require("./routes/imageRoute");
const fileUpload = require('express-fileupload');
const { cloudinaryConnect } = require('./config/cloudinary');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // or any writable path
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


cloudinaryConnect();

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoute);
app.use("/api/image", imageRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
