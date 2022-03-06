const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('DB is connected');
    } catch (error) {
        throw new Error('Error en la base de datos ' + error);
    }
}

module.exports = {
    dbConnection
}