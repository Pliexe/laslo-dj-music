import { Client } from 'discord.js';
import * as mongoose from 'mongoose';
import Prefix from '../Models/Prefix';

export interface IPrefix extends mongoose.Document
{
    guildID?: string;
    prefix?: string;
};

export class PrefixManager
{
    private prefixes: Map<string, string> = new Map();
    private client: Client;

    constructor(client: Client)
    {
        this.client = client;
    }

    public async loadPrefixes(): Promise<void>
    {
        let prefixes: IPrefix[] = await Prefix.find();

        prefixes.forEach((prefix =>
        {
            this.prefixes.set(prefix.guildID, prefix.prefix);
        }));

        this.client.on('guildDelete', (guild) =>
        {
            if (this.prefixes.has(guild.id))
                this.prefixes.delete(guild.id);
        });
    }

    public async getPrefix(guildID: string): Promise<string>
    {
        if (this.prefixes.has(guildID))
            return this.prefixes.get(guildID);
        else
            return "!";
    }

    public async setPrefix(guildID: string, prefix: string)
    {
        prefix = prefix || "!";

        Prefix.findOneAndUpdate({ guildID: guildID },
            {
                $setOnInsert: { guildID: guildID, prefix: "!" },
                $set: { prefix: prefix }
            },
            {
                upsert: true,
                new: true
            }
            , (err, data: IPrefix) =>
            {
                if (err) throw new Error(err);

                this.prefixes.set(guildID, data.prefix);
            }
        );
    }
}