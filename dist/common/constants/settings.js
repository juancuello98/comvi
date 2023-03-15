"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const bcrypt = require("bcrypt");
exports.jwtConstants = {
    secret: bcrypt.hash('comv1app$jw7', 12).toString(),
};
//# sourceMappingURL=settings.js.map