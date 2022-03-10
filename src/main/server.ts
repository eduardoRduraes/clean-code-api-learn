import { app } from './config/app'

const protocol = "http"
const address = 'localhost'
const port = 3333

app.listen(port, () => console.log(`Server running 🏃🏃🏃🏃 at ${protocol}//${address}:${port}`))
