//
// Sum Types to define IO status
//
class IO {}
export class UNKNOWN extends IO {}
export class PENDING extends IO {}
export class FAILURE extends IO {
  constructor(reason) {
    super()
    this.reason = reason
  }
}
export class SUCCESS extends IO {
  constructor(content) {
    super()
    this.content = content
  }
}
