import express from 'express'

const protocol = "http"
const address = 'localhost'
const port = 3333

const app = express()

app.listen(port, ()=> console.log(`Server running 🏃🏃🏃🏃 at ${protocol}//${address}:${port}`))
