"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayDateWithFormat = void 0;
const todayDateWithFormat = () => {
    let todayDate = new Date();
    let today;
    var dd = String(todayDate.getDate()).padStart(2, '0');
    var mm = String(todayDate.getMonth() + 1).padStart(2, '0');
    var yyyy = todayDate.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    today = today.replaceAll('/', '-');
    return today;
};
exports.todayDateWithFormat = todayDateWithFormat;
//# sourceMappingURL=date.helper.js.map