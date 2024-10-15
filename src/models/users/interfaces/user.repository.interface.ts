import { User, UserDocument } from "../user.schema";

export interface IUserRepository {
    findByEmail(email: string): Promise<UserDocument | null>;
    createUser(user: User): Promise<UserDocument>;
    getUserById(id: string): Promise<UserDocument | null>;
    updateUser(id: string, user: Partial<UserDocument>): Promise<UserDocument | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<UserDocument[]>;
    getUserData(user: UserDocument): UserData;
    findByUsername(username: string): Promise<UserDocument | null>;
    changePassword(id: string, newPassword: string): Promise<boolean>;
    findById(id: string): Promise<UserDocument | null>;
    create(user: any): Promise<UserDocument>;
    update(user: UserDocument): Promise<UserDocument>;
    findUsersById(usersId: string[], fieldsToSelect: string[]): Promise<UserDocument[]>;
    createRequest(email: string, id: string): Promise<void>;
}

export interface UserData {
    id: string;
    name: string;
    lastname: string;
    email: string;
    // Add other user properties as needed
}