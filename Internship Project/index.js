import express from 'express'
import compression from 'compression'
import { getTickerInfo, getTickerAndColumnInfo, getTickerAndColumnInfoWithDuration } from './connection.js'
const app = express()
const port = 3000

app.use(compression({level: 9}))



// ticker=AAPL&column=revenue,gp&period=5y
// ticker=ZS&column=revenue,gp&period=5y


app.get('/', (req, res) => {
    const hello = 'Hello'
    res.send(hello)
})

app.get('/Api', async (req,res) => {
    const ticker = req.query.ticker
    const column = req.query.column
    const period = req.query.period
    let rows
    
    if(!ticker && !column && !period) {
        res.send("Nothing in Query Params 🙄")
    }else if(!column && !period) {
        rows = await getTickerInfo(ticker)
        res.send(rows)
    }else if(!period) {
        rows = await getTickerAndColumnInfo(ticker, column)
        res.send(rows)
    }else{
        rows = await getTickerAndColumnInfoWithDuration(ticker, column, period)
        res.send(rows)
    }
})



app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})