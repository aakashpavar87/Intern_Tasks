import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise()

export async function getTickerInfo(tickerName) {
    const [rows] = await pool.query(`SELECT * FROM financialdata where ticker=?`, [tickerName])
    return rows
}

export async function getTickerAndColumnInfo(ticker, column) {
    // select revenue,gp from financialdata where ticker='ZS';
    const columns = ("ticker,date,"+column).split(',').map(col => mysql.escapeId(col.trim())).join(',');
    const query = `SELECT ${columns} FROM financialdata WHERE ticker=?`;
    const [rows] = await pool.query(query, ticker);
    return rows;
}

export async function getTickerAndColumnInfoWithDuration(ticker, column, duration) {
    const columns = ("ticker,date,"+column).split(',').map(col => mysql.escapeId(col.trim())).join(',');
    const query = `SELECT ${columns} FROM financialdata WHERE ticker=? ORDER BY date DESC`;
    const [rows] = await pool.query(query, ticker);
    const durationNumber = Number.parseInt(duration.charAt(0))
    const firstDate = rows[0].date.toLocaleDateString()
    const firstYear = Number.parseInt(firstDate.split('/')[2])
    // console.log(firstDate);
    const durationYear = Number.parseInt(firstDate.split('/')[2]) - durationNumber + 1
    // console.log(durationYear);
    return rows.filter(row=>{  
        let dateString=row.date.toLocaleDateString()
        let currentYear = Number.parseInt(dateString.split('/')[2])
        return (currentYear == firstYear || currentYear >= durationYear) 
    })
}