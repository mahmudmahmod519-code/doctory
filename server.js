const app = require("./app");
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