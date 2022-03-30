import { Server,User } from '@models';
import { ChallengeHandler, UserHandler, ServerHandler } from '@handlers';
import { BaseController } from './base.controller';
import { createEmbed, regex } from '@utils';
import { ChallengeController} from './challenge.controller';

export enum ServerCommand {
    CHANNEL = 'channel',
    REFRESH = 'refresh',
}

export class ServerController extends BaseController {
    handle = () => {
        const { subcommand, _args } = this.getArgs(['subcommand'], false);

        const mapping = {
            [ServerCommand.CHANNEL]: this.initialize,
            [ServerCommand.REFRESH]: this.refresh,
        };

        if (!(subcommand in mapping)) {
            return this.error();
        }

        mapping[subcommand as ServerCommand](_args.slice(1));
    }

    initialize = async (args: ReadonlyArray<string>): Promise<void> => {
        const [mention] = args;

        if (!regex.mentions.CHANNEL.test(mention)) {
            this.messageAuthor('Invalid channel provided.');
            return;
        }

        const [, channelId] = mention.match(regex.mentions.CHANNEL);

        const server = await ServerHandler.initialize(this.message.guild.id, channelId);
        this.setServer(server);

        this.message.channel.send(`CTF Challenges channel has been configured to <#${channelId}>.`);

        // Send initial stuff here
        this.updateAnnouncement(true);
    };

    updateAnnouncement = async (allowEmpty = false): Promise<void> => {
        await this.loadAnnouncement();
        const data = {
            leaderboard: await UserHandler.getLeaderboard(this.server),
            challenges: await ChallengeHandler.list(this.server),
        };

        await this.announce(data, allowEmpty);
    }

    refresh = (_): void => {
        this.updateAnnouncement();
        this.message.channel.send('CTF Bot for this server has been refreshed.');
    }

    getLeaderboard = async (): Promise<void> => {
        if(this.message.channel.id === '939727478203764746') { // #challenges-leaderboard channel id
            const { channel } = this.message;
            const leaderboard = await UserHandler.getLeaderboard(this.server);
            
            if (!leaderboard.length) {
                channel.send('No data for leaderboard yet.');
                return;
            }
            
            const ranking = leaderboard.reduce((ranking, user, rank) => `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`, '');
            const embed = createEmbed()
                .setTitle('Leaderboard')
                .setDescription(ranking);

            channel.send(embed);
        }
        else {
            this.message.delete();
            const { channel, author } = this.message;
            channel.send(`<@${this.message.author.id}> Use #challenges-leaderboard channel for the leaderboard command.`);            
        }
        
    }

    deleteUser = async(): Promise<void> => {
        if(this.message.member.roles.cache.some(role => role.name === "Admin")){
            try{
                const args = this.getArgs(['userId']);
                const userId = args.userId.slice(3,-1);

                await User.deleteUser(userId);

                // Updates the leaderboard
                const leaderboard = await UserHandler.getLeaderboard(this.server);
                await this.loadAnnouncement();
                
                this.announce({ leaderboard},true);
                
                this.message.channel.send(`<@${userId}> has been removed from the leaderboard`);
                
                
                
                // return;
            }catch{
                this.message.channel.send("Unable to remove user");
                return;
            }
        }else{
            this.message.channel.send('You do not have permission to remove a user');
        }
    }
}
