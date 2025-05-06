export interface User {
    FirstName: string;
    LastName: string;
    Gender: string;
    DateOfBirth: Date;
    PhoneNumber: string;
    Username: string;
    Email: string;
    ProfilePicture?:File;
    Street: string;
    City: string;
    Country: string;
    Password: string;
    ConfirmPassword: string;
}