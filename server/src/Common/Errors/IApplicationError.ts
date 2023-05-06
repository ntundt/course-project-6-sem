export default interface IApplicationError {
  toJSON(): {
    err: number,
    message: string,
    payload?: object,
  }
}
