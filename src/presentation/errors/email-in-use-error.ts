export class EmailInUserError extends Error {
  constructor () {
    super(`the received email is already in use`)
    this.name = 'EmailInUserError'
  }
}
