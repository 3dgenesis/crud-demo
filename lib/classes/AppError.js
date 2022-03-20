class AppError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = data;
    }

    toJson() {
        const { name, message, statusCode, data, stack } = this
        return JSON.stringify({name, message, statusCode, data, stack})
    }
}

module.exports = { AppError };