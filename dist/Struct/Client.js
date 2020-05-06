"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class MusicClient extends discord_js_1.Client {
    constructor(config) {
        super(config);
        this.queue = new Map();
    }
}
exports.MusicClient = MusicClient;
//# sourceMappingURL=Client.js.map