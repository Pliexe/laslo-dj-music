"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, options) {
        this.name = name;
        this.aliases = options.aliases || [];
        this.info = options.info;
        this.usage = options.usage;
        this.guildOnly = options.guildOnly || false;
    }
    run(message, args, syntaxError) {
        message.channel.send("Error: command not implemented.");
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map