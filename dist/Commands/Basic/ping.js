"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Command_1 = require("../../Handlers/Command");
module.exports = class extends Command_1.Command {
    constructor(cmdHandler) {
        super('ping', {
            aliases: ['pong'],
            info: 'Shows the latency of the bot',
            usage: 'ping'
        });
        this.bot = cmdHandler.client;
    }
    run(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const m = yield message.channel.send("Ping!");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(this.bot.ws.ping)}ms`);
        });
    }
};
//# sourceMappingURL=ping.js.map