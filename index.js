/*        Champion
 *      Discord bot
 *   
 *   created by Cristinel#7969
 *   started on 22.02.2022
 */
const Discord = require('discord.js');
const fs = require("fs");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ]
});
require('dotenv').config();
const puppeteer = require('./node_modules/puppeteer')
const linkCheck = require('link-check');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./config/firm-circlet-331310-6da4b7b9b5d3');
const doc = new GoogleSpreadsheet(process.env.id);
async function login(doc) {
    await doc.useServiceAccountAuth(creds);
}
const prefix = '$';
const owner = '272049642261315596';

const linkrow = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
        .setStyle("LINK")
        .setLabel("Guilds")
        .setURL(process.env.database)
)
Client.on('ready', async () => {
    console.log("Bot is online.");
    Client.user.setActivity('Arhiva Campion', {
        type: "WATCHING"
    });
    Client.api.applications(Client.user.id).commands.post({
        data: {
            name: "campion",
            description: "Search for a problem solution on arhiva.campion",
            options: [
                {
                    name: "problem",
                    description: "Problem's Name",
                    type: 3,
                    required: true
                },
                {
                    name: "language",
                    description: "Progammed Language",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "C/C++",
                            value: '.cpp',
                        },
                        {
                            name: "Pascal (May take longer)",
                            value: '.pas',
                        },
                    ]
                }
            ]
        }
    });

    Client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;
        const {commandName, options } = interaction;
        if (commandName == "campion") {
            await interaction.reply({
                content: "Please wait! Check your DM inbox!",
                ephemeral: true,
            })
            const problem = options._hoistedOptions[0].value;
            const description = options._hoistedOptions[1].value;
            const message = {
                content: "campion " + problem + description,
                author: Client.users.cache.find(user => user.id === interaction.member.user.id),
                guild: interaction.guild
            }
            start(message);
        }      
    })
})

process.on('unhandledRejection', error => {
    if (error.httpStatus == 404) return;
    else if (error == 'DiscordAPIError: Unknown Message') return;
    else console.log(error);
});

Client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.id != owner) return;
    var mesaj = message.content.toLowerCase();

    if (mesaj.startsWith(`${prefix}guilds`)) {
        if (message.guild) message.delete();
        message.author.send({
            components: [linkrow]
        });
    }
    if (mesaj.startsWith(`${prefix}delete`)) {
        var args = mesaj.split(' ');
        try {
            Client.guilds.cache.get(args[1]).leave();
            message.author.send("Server deleted!");
        } catch (e) {
            console.log(e);
        }
    }
})

async function start(message) {
    login(doc);
    await doc.loadInfo();

    campion(message);
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    var ok = 0;
    rows.forEach((row) => {
        if (row.id == message.author.id) {
            row.count++;
            row.last = message.content.split(" ")[1];
            row.server_name = message.guild.name;
            row.server_id = message.guild.id;
            row.name = message.author.username + '#' + message.author.discriminator;
            ok = 1; row.save();
        }
    })
    if (!ok) await doc._rawSheets[0].addRows([{ server_id: message.guild.id, server_name: message.guild.name, id: message.author.id, name: message.author.username + '#' + message.author.discriminator, count: 1, last: message.content.split(" ")[1] }]);

}

function campion(message) {
    let args = message.content.split(" ");
    let a = 0;
    a = indexfind(message, 1, args[1]);
    if (a == 0)
        return message.author.send(`Can't find the solution of **${args[1]}**!`);
}

async function indexfind(message, i, file) {
    let back = i + `/${file}`;
    let link = `${process.env.server}${back}`;
    
    linkCheck(link, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        if (result.status == 'dead') {
            if (i > 65000) return message.author.send(`Can't find the solution of **${file}**!`);
            indexfind(message, i + 1, file);
        }    
        else return fetchfile(result.link, message, file);
    });
}

async function fetchfile(link, message, file) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    let text = await page.goto(link, {
        waitUntil: "networkidle2",
    }).then(async (data) => {
        let tex = await data.text();
        return tex;
    });
    
    fs.writeFile(`./${file}`, text, err => {
        if (err) {
            return console.error(err);
        }
    })

    await browser.close();
    await message.author.send({ files: [`./${file}`] })

    fs.unlink(`./${file}`, (err) => {
        if (err) throw err;
    });
    return 1;
    
}

Client.login(process.env.login)