export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'dafds2498754!!@435rewqrdfg',
  protocol: "http",
  address : "localhost"
}
