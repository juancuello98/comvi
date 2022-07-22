"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_CODE_STATUS = exports.MESSAGE_RES = void 0;
var MESSAGE_RES;
(function (MESSAGE_RES) {
    MESSAGE_RES["userAlreadyExist"] = "User already exist in our system";
    MESSAGE_RES["invalid_code"] = "Invalid Code";
})(MESSAGE_RES = exports.MESSAGE_RES || (exports.MESSAGE_RES = {}));
var VERIFICATION_CODE_STATUS;
(function (VERIFICATION_CODE_STATUS) {
    VERIFICATION_CODE_STATUS["OK"] = "VALIDATED";
    VERIFICATION_CODE_STATUS["IN_PROGRESS"] = "EN_PROGRESO";
    VERIFICATION_CODE_STATUS["EXPIRED"] = "CODE_EXPIRED";
    VERIFICATION_CODE_STATUS["RETRY_INVALID"] = "RETRY_EXPIRED";
})(VERIFICATION_CODE_STATUS = exports.VERIFICATION_CODE_STATUS || (exports.VERIFICATION_CODE_STATUS = {}));
//# sourceMappingURL=enum-auth.js.map