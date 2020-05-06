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
    constructor(commandHandler) {
        super('prefix', {
            aliases: ['setprefix'],
            info: 'Changed the prefix',
            usage: 'prefix <new prefix>'
        });
        this.prefixManager = commandHandler.prefixManager;
    }
    run(message, args, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.guild.ownerID !== message.author.id)
                return errorMessage.noPermission();
            if (!args[0])
                return errorMessage.syntaxErr(this.usage);
            let newPrefix = args[0];
            if (newPrefix.length > 4)
                return errorMessage.syntaxErr(this.usage, '<new prefix>', 'Prefix may not be longer than 4 characters!');
            let oldPrefix = yield this.prefixManager.getPrefix(message.guild.id);
            if (oldPrefix == newPrefix)
                return errorMessage.syntaxErr(this.usage, '<new prefix>', 'Prefix is already this one.', true);
            this.prefixManager.setPrefix(message.guild.id, newPrefix);
            message.channel.send("Changed prefix to `" + newPrefix + "`!");
        });
    }
};
//# sourceMappingURL=prefix.js.map