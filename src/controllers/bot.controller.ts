import { Message } from 'discord.js';
import {
    ChallengeController,
    ServerController,
} from '@controllers';
import { ServerGuard } from '@guards';
import { createEmbed } from '@utils';
import { mention } from '@utils/discord';
import { CommandUsage, Command } from '../constants';
import { isRFC3339 } from 'class-validator';

export class BotController {
    private server: ServerController;
    private challenge: ChallengeController;

    constructor(private message: Message) {}

    handle = async (command: Command): Promise<void> => {
        const publicCommands = [
            Command.PING,
            Command.CONFIG,
            Command.HELP,
        ];

        const server = await ServerGuard.getServer(this.message, !publicCommands.some(cmd => cmd === command));

        this.server = new ServerController({ message: this.message, server });
        this.challenge = new ChallengeController({ message: this.message, server });

        const mapping = {
            [Command.PING]: this.ping,
            [Command.CONFIG]: this.server.handle,
            [Command.CREATE]: this.challenge.create,
            [Command.SET_FLAG]: this.challenge.setFlag,
            [Command.SUBMIT]: this.challenge.submit,
            [Command.LEADERBOARD]: this.server.getLeaderboard,
            [Command.LIST]: this.challenge.list,
            [Command.INFO]: this.challenge.info,
            [Command.DELETE]: this.challenge.delete,
            [Command.HELP]: this.help,
            [Command.DELETEUSER]: this.server.deleteUser
        };

        if (!(command in mapping)) {
            return this.error();
        }

        mapping[command]();
    }

    private error = (): void => {
        const { channel, author } = this.message;
        channel.send(`${mention(author)} I wasn't able to recognize what you wanted to do.`);
    };

    private ping = (): void => {
        const { channel, author } = this.message;
        channel.send(`${mention(author)} pong`);
    };

    private help = (): void => {
        if(this.message.channel.id === '939727443105828904'){ // restrict help command to help channel
            const fields = CommandUsage.filter(command =>command.admin === false)
            
            const embed = createEmbed()
                .setTitle('CTF Bot Commands')
                .setDescription('To interact with CTF bot, use `-ctf` followed by any of the commands below.')
                .addFields(fields.map((command) => 
                    !command.admin && ({
                    name: `\`${command.command}\``,
                    value: command.description,
                    inline: true,
                    })
                ));

            this.message.channel.send(embed);
        }
        else if(this.message.channel.id === '954015176955408414') { // allow help command in create-challenges channel
            const embed = createEmbed()
                .setTitle('CTF Bot Commands')
                .setDescription('To interact with CTF bot, use `-ctf` followed by any of the commands below.')
                .addFields(CommandUsage.map((command) => ({
                    name: `\`${command.command}\``,
                    value: command.description,
                    inline: true,
                })));

            this.message.channel.send(embed);
        }
        else {
            this.message.delete();
            const { channel, author } = this.message;
            channel.send(`${mention(author)} Use #help channel for the help command.`);            
        }
        
    }
}
