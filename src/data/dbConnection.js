import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    option: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const createConnection = async () => {
    try {
        await sql.connect(config);
        console.log("\x1b[32mDatabase connected successfully\x1b[0m");
    } catch (error) {
        console.error("\x1b[31mDatabase connection failed\x1b[0m", error);
    }
};

export default createConnection;