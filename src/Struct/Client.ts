import { Client } from "discord.js";
import { MusicPlayer } from "../Handlers/MusicPlayer";

export class MusicClient extends Client
{
    public queue: Map<string, MusicPlayer>;

    constructor(config)
    {
        super(config);

        this.queue = new Map();
    }
}