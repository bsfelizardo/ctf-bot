import { Client, Message } from 'discord.js';
import { BotController } from '@controllers';
import { regex } from '@utils';
import { Command, Secrets } from './constants';

class CtfBot {
    static NAMESPACE = '-ctf';
    static FLAG = '[fF][lL][aA][gG]'
    // static FLAG = 'flag';
    

    private client: Client = new Client();

    init = () => {
        this.client.login(Secrets.BOT_TOKEN);
    };

    listen = () => {
        this.client.on('ready', () => {
            console.log('> Bot started listening');
        });

        this.client.on('message', (message: Message) => {
            const pattern = new RegExp(`^${CtfBot.NAMESPACE} ((.|\\n)+)`);
            const flag_pattern = new RegExp(`${CtfBot.FLAG}`);
            // const authorId = '817929226304880660';  //bot id for PB server
            const authorId = '811948960393723914'; //bot id for YSES Week Server
            
     
            if ( !pattern.test(message.content) && flag_pattern.test(message.content) && authorId !== message.author.id){
                message.delete();
                return;
            }

            if (!pattern.test(message.content)) return;
            

            const [, text] = message.content.match(pattern);
            message.content = text;
            
            const [, command] = text.match(regex.COMMAND);
            
            const bot = new BotController(message);
            bot.handle(command as Command);
        });
    };
}

export default CtfBot;
