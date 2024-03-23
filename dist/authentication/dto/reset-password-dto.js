"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const existing_user_dto_1 = require("../../models/users/dto/existing-user.dto");
class ResetPasswordDTO extends (0, mapped_types_1.PartialType)(existing_user_dto_1.LoginDTO) {
}
exports.ResetPasswordDTO = ResetPasswordDTO;
//# sourceMappingURL=reset-password-dto.js.map