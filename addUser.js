const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/adminPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function addUser(username, plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log('User added:', username);
    mongoose.connection.close();
}

addUser('admin', 'securepassword'); // Replace with your admin username and password
