/**
 * 校验
 * @type {{validateUndefined(*, *, *), validateEmpty(*, *, *), validateNull(*, *, *), validateCondition(*=, *, *): void}}
 */
import exception from './exception';

var Assert = {
    /**
     * 校验是否为undefined
     */
    validateUndefined(o, msg, error){
        if(o === undefined){
            throw new exception.ValidateException(msg, error)
        }
    },
    /**
     * 校验是否为null
     */
    validateNull(o, msg, error){
        if(o === null){
            throw new exception.ValidateException(msg, error)
        }
    },
    validateNone(o, msg, error){
        if(o === undefined || o === null){
            throw new exception.ValidateException(msg, error)
        }
    },
    /**
     * 校验是否为空：undefined，null，""
     */
    validateEmpty(o, msg, error){
        if(
            !o || (Array.isArray(o) && o.length() === 0) || JSON.stringify(o) === '{}'
        ){
            throw new exception.ValidateException(msg, error)
        }
    },
    /**
     * 校验条件是否成立
     */
    validateCondition(condition, msg, error){
        if(!!condition){
            throw new exception.ValidateException(msg, error)
        }
    }
}

export default Assert;
