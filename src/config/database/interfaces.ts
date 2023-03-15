export interface IDatabaseConfigService {

    checkExistOneInUsers(condition: Object);
  
    userFindOne(condition: Object);
  
    createOneUser(newUser: Object);
  
    updateItem(value: Object, condition: Object);
    
  }