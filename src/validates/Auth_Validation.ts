import Joi, { ObjectSchema } from 'joi';

// Định nghĩa kiểu dữ liệu cho dữ liệu đăng ký
interface RegisterData {
    username: string;
    email: string;
    password: string;
}

const registerValidator = (data: RegisterData): Joi.ValidationResult => {
    const schema: ObjectSchema = Joi.object({
        username: Joi.string().min(6).max(225).required(),
        email: Joi.string().min(6).max(225).required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
    });

    return schema.validate(data);
}

export { registerValidator };
