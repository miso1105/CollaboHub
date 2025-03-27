class CustomError extends Error {
    constructor(errorCodeObject) {
        super(errorCodeObject.message)
        this.status = errorCodeObject.status
        this.code = errorCodeObject.code
    }
}

module.exports = CustomError;