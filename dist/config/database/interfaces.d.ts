export interface IDatabaseConfigService {
    checkExistOneInUsers(condition: Object): any;
    userFindOne(condition: Object): any;
    createOneUser(newUser: Object): any;
    updateItem(value: Object, condition: Object): any;
}
