/**
 * 逻辑异常
 */
class LogicException extends Error{
    constructor(message, error){
        super(message);
        this.name = "LogicException";
        this.error = error || '';
    }
}

/**
 * 参数校验异常
 */
class ValidateException extends LogicException {
    constructor(message, error){
        super(message, error);
        this.name = "ValidateException";
    }
}

export default {
    LogicException,
    ValidateException
}

