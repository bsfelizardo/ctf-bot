import * as dotenv from 'dotenv';

dotenv.config();

const {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
    BOT_AVATAR,
} = process.env;

export const Secrets = {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
    BOT_AVATAR,
};

export enum Command {
    PING = 'ping',
    CONFIG = 'config',
    CREATE = 'create',
    SET_FLAG = 'set-flag',
    SUBMIT = 'submit',
    LEADERBOARD = 'leaderboard',
    LIST = 'list',
    INFO = 'info',
    DELETE = 'delete',
    HELP = 'help',
    TEST = 'test',
    DELETEUSER = 'deleteUser'
};

export const CommandUsage = [
    {
        command: 'ping',
        description: 'Check bot availability',
        admin: true,
    },
    {
        command: 'create <level> \"<title\"> \"<description>\"',
        description: 'Create new CTF challenge',
        admin: true,
    },
    {
        command: 'set-flag <ctf-id> \"<flag>\"',
        description: 'Set flag to a given challenge.',
        admin: true,
    },
    {
        command: 'help',
        description: 'Show this help message',
        admin: false,
    },
    {
        command: 'info <ctf-id>',
        description: 'Show info on a given challenge',
        admin: false,
    },
    {
        command: 'list',
        description: 'List CTF challenges',
        admin: false,
    },
    {
        command: 'submit <ctf-id> \"<flag>\"',
        description: 'Submit flag, please enclose the flag with `||` to avoid revealing it to other users. Example: -ctf submit 0x00000 ||\"flag{sample}\"||',
        admin: false,
    },
    {
        command: 'leaderboard',
        description: 'Show leaderboard',
        admin: false,
    },
    
    {
        command: 'delete <ctf-id>',
        description: 'Delete CTF challenge',
        admin: true,
    },
    
];

export enum Color {
    DEFAULT = '#ff0000',
};
