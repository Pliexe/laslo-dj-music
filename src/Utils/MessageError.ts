import { MessageEmbed, Message } from 'discord.js';

export class MessageErrorSender
{
    private message: Message;

    constructor(message: Message)
    {
        this.message = message;
    }

    feedback(syntax: string, custommsg: string): void
    {
        this.message.channel.send(new MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription(custommsg)
            .addField('Usage', `${syntax}`)
            .setColor(0xdbdb00)
            .setTimestamp()
        );
    }

    syntaxErr(syntax: string, invalid?: string, custommsg?: string, yellow?: boolean): void
    {
        this.message.channel.send(new MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription(!!invalid ? (!!custommsg ? `❌ Invalid **${invalid}** argument given : \`${custommsg}\`` : `❌ Invalid **${invalid}** argument given`) : '❌ No arguments given.')
            .addField('Usage', `${!!invalid ? syntax.replace(invalid, `**${invalid}**`) : syntax}`)
            .setColor(!yellow ? 0xed0602 : 0xdbdb00)
            .setTimestamp()
        );
    }

    noPermission(): void
    {
        this.message.channel.send(new MessageEmbed()
            .setAuthor(this.message.member.nickname || this.message.author.username, this.message.author.avatarURL())
            .setDescription('No permission to run this command.')
            .setColor(0xed0602)
            .setTimestamp()
        );
    }
}