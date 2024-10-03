import { faker, Sex } from '@faker-js/faker'
import { F } from '@faker-js/faker/dist/airline-C5Qwd7_q';
const User = require('@/models/UserModel')

const createUser = async () => {
    const newUser = new User({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        sex : faker.person.sex(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dataOfBirth: faker.date.birthdate(),
        email: faker.internet.email(),
        profile_picture: faker.image.avatar(),
        biography: faker.person.jobTitle()
    });

    try {
        const savedUser = await newUser.save();
        console.log('Người dùng đã được tạo thành công!');
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error);
    }
};

// createUser();

export const createRandomUsers = async (num: number) => {
    for(let i = 0; i <= num; i++){
        await createUser();
    }
}

createRandomUsers(10);