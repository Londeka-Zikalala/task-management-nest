import * as pgPromise from 'pg-promise';
import * as dotenv from 'dotenv';
dotenv.config();

const pgp = pgPromise();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString: string = process.env.DATABASE_URL|| '';

const db = pgp(connectionString);
export default db;