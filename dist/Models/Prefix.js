"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('prefix', new mongoose_1.Schema({
    guildID: String,
    prefix: String
}));
//# sourceMappingURL=Prefix.js.map