export enum MESSAGE_RES {
    userAlreadyExist = 'User already exist in our system',
    invalid_code = 'Invalid Code'
}

export enum VERIFICATION_CODE_STATUS {
    OK = 'VALIDATED',
    IN_PROGRESS = 'EN_PROGRESO',
    EXPIRED = 'CODE_EXPIRED',
    RETRY_INVALID = 'RETRY_EXPIRED',
}