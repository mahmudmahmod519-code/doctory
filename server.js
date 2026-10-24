const express = require("express");
const app = express();

// global configration server
require('./config/server-config')(app);

//trafic
require('./routes/index')(app);

const connectDB = require("./config/database");

function runServer() {
    connectDB()
        .then(() => {
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error during database connection:", error.message);
            process.exit(1);
        });
}

runServer();
