const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const axios = require('axios');
const { catchAsync } = require('../utils');
const { setTimeout } = require('timers/promises');

const router = express.Router();
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('https://website.org/api/discord/callback');

router.get('/login', (req, res) => {
  console.log("client_id = "+ CLIENT_ID);
  console.log("client_id process= "+ process.env.CLIENT_ID);
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds.join&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;

  const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://website.org/api/discord/callback',
        scope: 'identify%20guilds.join%20bot',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
		})
    
    const json = await oauthResult.json();
    console.log("json = ",json);

    res.redirect(`/?token=${json.access_token}`);
}));

router.post('/levelUp', async (req, res) => {
  //console.log("req = ",req.body);
  if (!req.body.code) throw new Error('NoCodeProvided');
  const accessToken = req.body.code;
  
  //console.log("join api called token = ",accessToken);

  const userResult = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  
  const profile = await userResult.json();
  //console.log("profile = ",profile);

  /* Remove Roles (Role names: Guest,Verified, Rule Reader, Hello) */

  //let roles = ["948840954788450344","946418840093487204","946399796355293214","946058368580222986"]
  let roles = ["946058368580222986"]

  for (i = 0; i < roles.length; i++) {
    console.log('Deleting Role ' + roles[i]);
    const deleteRole = await axios({
      method: 'DELETE',
          url: `https://discord.com/api/guilds/${process.env.SERVER_ID}/members/${profile.id}/roles/${roles[i]}`,
          headers: {
              'Authorization': `Bot ${process.env.BOT_TOKEN}`,
              'Content-type': 'application/json'
          },
          json: {
              'access_token': `${accessToken}`
          }
      }).then().catch(err => {console.log(err.data.message)});
      await setTimeout(200);
  }
  
  console.log("Sleep 200 ms");
  await setTimeout(200);
  
  /* Add Explorio Role */

  const roleResult = await axios({
    method: 'PUT',
        url: `https://discord.com/api/guilds/${process.env.SERVER_ID}/members/${profile.id}/roles/${process.env.ROLE_ID}`,
        headers: {
            'Authorization': `Bot ${process.env.BOT_TOKEN}`,
            'Content-type': 'application/json'
        },
        json: {
            'access_token': `${accessToken}`
        }
    }).then().catch(err => {console.log(err.data.message)});

    //console.log("roleResult = ",roleResult);
    let roleStatus=0;
    if (roleResult.status == 204)
    {  
      roleStatus=1;
      console.log("leveled up");
    }

    //res.redirect(`/?token=${json.access_token}`);
  
  const data = {
   status:roleStatus
  }

  res.status(201).json(data);
 });

module.exports = router;
