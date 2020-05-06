import { model, Schema } from 'mongoose';

export default model('prefix', new Schema({
    guildID: String,
    prefix: String
}));