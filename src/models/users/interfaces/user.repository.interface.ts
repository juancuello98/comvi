import { User, UserDocument } from "../user.schema";

export interface IUserRepository {
    findByEmail(email: string): Promise<User>;
    createUser(user: User): Promise<User>;
    getUserById(id: string): Promise<User>;
    updateUser(id: string, user: Partial<UserDocument>): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    // getUserData(user: UserDocument): UserData;
    findByUsername(username: string): Promise<User>;
    changePassword(id: string, newPassword: string): Promise<boolean>;
    findById(id: string): Promise<User>;
    create(user: any): Promise<User>;
    update(user: UserDocument): Promise<User>;
    findUsersById(usersId: string[], fieldsToSelect: string[]): Promise<User[]>;
}

export interface UserData {
    id: string;
    name: string;
    lastname: string;
    email: string;
    // Add other user properties as needed
}