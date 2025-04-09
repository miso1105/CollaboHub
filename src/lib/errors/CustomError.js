const dotenv = require('dotenv');
dotenv.config();

class CustomError extends Error {
    constructor(errorCodeObject, customMessage, originalError) {
        const isProd = process.env.NODE_ENV === 'production';
        const safeMessage = isProd ? '에러가 발생했습니다.' : customMessage || errorCodeObject.message;
        super(safeMessage);
        this.status = errorCodeObject.status;
        this.code = errorCodeObject.code;
        this.original = originalError;
    }

    toJson() {
        const json = {
            message: this.message,
            code: this.code,
        };

        if (process.env.NODE_ENV !== 'production' && this.original) { 
            if (typeof this.stack === 'string') {
                json.original = this.original.stack.split('\n').slice(0, 3).join('\n');
            } else {
                json.original = this.original;
            }
        }
        
        return json;
    }
}
module.exports = CustomError;