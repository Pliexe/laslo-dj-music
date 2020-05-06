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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Prefix_1 = __importDefault(require("../Models/Prefix"));
;
class PrefixManager {
    constructor(client) {
        this.prefixes = new Map();
        this.client = client;
    }
    loadPrefixes() {
        return __awaiter(this, void 0, void 0, function* () {
            let prefixes = yield Prefix_1.default.find();
            prefixes.forEach((prefix => {
                this.prefixes.set(prefix.guildID, prefix.prefix);
            }));
            this.client.on('guildDelete', (guild) => {
                if (this.prefixes.has(guild.id))
                    this.prefixes.delete(guild.id);
            });
        });
    }
    getPrefix(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.prefixes.has(guildID))
                return this.prefixes.get(guildID);
            else
                return "!";
        });
    }
    setPrefix(guildID, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            prefix = prefix || "!";
            Prefix_1.default.findOneAndUpdate({ guildID: guildID }, {
                $setOnInsert: { guildID: guildID, prefix: "!" },
                $set: { prefix: prefix }
            }, {
                upsert: true,
                new: true
            }, (err, data) => {
                if (err)
                    throw new Error(err);
                this.prefixes.set(guildID, data.prefix);
            });
        });
    }
}
exports.PrefixManager = PrefixManager;
//# sourceMappingURL=PrefixManager.js.map