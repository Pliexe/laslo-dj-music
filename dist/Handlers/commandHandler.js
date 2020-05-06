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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MessageError_1 = require("../Utils/MessageError");
const PrefixManager_1 = require("./PrefixManager");
class CommandHandler {
    constructor(client) {
        this.commands = new Map();
        this.aliases = new Map();
        this.client = client;
        this.prefixManager = new PrefixManager_1.PrefixManager(this.client);
    }
    static readFiles(directory) {
        let files = [];
        fs.readdirSync(directory).forEach(file => {
            let location = path.join(directory, file);
            if (fs.lstatSync(location).isDirectory()) {
                files = files.concat(CommandHandler.readFiles(location));
            }
            else {
                files.push(location);
            }
        });
        return files;
    }
    load(directory) {
        let commands, cmdLocations;
        commands = cmdLocations = CommandHandler.readFiles(directory)
            .filter(file => file.endsWith('.js'));
        cmdLocations = cmdLocations.map(cmd => cmd.slice(cmd.indexOf('Commands') + 9));
        commands = commands.map(require);
        commands.forEach(command => {
            this.loadCommand(new command(this), cmdLocations);
        });
        this.register();
    }
    loadCommand(command, cmdLocations) {
        let location = cmdLocations.find(cl => cl.includes("\\" + command.name));
        command.category = location.slice(0, location.indexOf(command.name) - 1);
        this.commands.set(command.name, command);
        command.aliases.forEach(alias => {
            this.aliases.set(alias, command.name);
        });
    }
    register() {
        this.client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
            let prefix = yield this.prefixManager.getPrefix(message.guild.id);
            if (message.author.bot || !message.content.startsWith(prefix))
                return;
            const [command, ...args] = message.content
                .slice(prefix.length)
                .split(/ +/g);
            let cmd = this.commands.get(command.toLowerCase());
            if (!cmd) {
                let cmdName = this.aliases.get(command.toLowerCase());
                cmd = this.commands.get(cmdName);
                ;
            }
            if (!cmd)
                return;
            if (cmd.guildOnly && !message.guild) {
                message.channel.send('This command is only available in guilds');
                return;
            }
            try {
                yield cmd.run(message, args, new MessageError_1.MessageErrorSender(message));
            }
            catch (err) {
                console.error(err);
                message.reply('an error occured :C');
            }
        }));
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=commandHandler.js.map