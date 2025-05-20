export interface User {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    username: string;
    email: string;
    profilePicture?: File;
    street: string;
    city: string;
    country: string;
    password: string;
    confirmPassword: string;
}