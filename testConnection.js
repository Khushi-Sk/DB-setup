const db = require('./models/index.js');

(async () => {
    try{
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    } finally {
        await db.sequelize.close();
    }
})();
