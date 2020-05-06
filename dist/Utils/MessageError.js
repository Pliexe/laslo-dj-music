"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class MessageErrorSender {
    constructor(message) {
        this.message = message;
    }
    feedback(syntax, custommsg) {
        this.message.channel.send(new discord_js_1.MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription(custommsg)
            .addField('Usage', `${syntax}`)
            .setColor(0xdbdb00)
            .setTimestamp());
    }
    syntaxErr(syntax, invalid, custommsg, yellow) {
        this.message.channel.send(new discord_js_1.MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription(!!invalid ? (!!custommsg ? `❌ Invalid **${invalid}** argument given : \`${custommsg}\`` : `❌ Invalid **${invalid}** argument given`) : '❌ No arguments given.')
            .addField('Usage', `${!!invalid ? syntax.replace(invalid, `**${invalid}**`) : syntax}`)
            .setColor(!yellow ? 0xed0602 : 0xdbdb00)
            .setTimestamp());
    }
    noPermission() {
        this.message.channel.send(new discord_js_1.MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription('No permission to run this command.')
            .setColor(0xed0602)
            .setTimestamp());
    }
}
exports.MessageErrorSender = MessageErrorSender;
//# sourceMappingURL=MessageError.js.map