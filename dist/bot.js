"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path = __importStar(require("path"));
const commandHandler_1 = require("./Handlers/commandHandler");
const Client_1 = require("./Struct/Client");
mongoose_1.default.connect(process.env.MONGOOSE_LOGIN, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Client_1.MusicClient({ disableMentions: "everyone" });
let cmdHandler = new commandHandler_1.CommandHandler(bot);
cmdHandler.load(path.join(__dirname, './Commands'));
bot.on('ready', () => {
    console.log('Bot turned on!');
});
bot.login(process.env.TOKEN);
//# sourceMappingURL=bot.js.map