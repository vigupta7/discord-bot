# Discord Role Grant Automation Bot

This Bot contains React Web Application which shows a Captcha Challenge to users and the user has to login with its discord ID.

Once the user is verified, then a New Role is granted to the user on given discord channel.

This App can be used by several discord groups for user verification and accordingly assign a role to user with specefic privliges in Discord.

To Run the App, user must a Bot Token in Discord developer settings.

All the details like Client_id, Secret, Bot Token are to mentioned in the .env file for this app to work.

After updating the details, make the app run with below command.

npm i // to install packages mentioned in package.json file

node server.js  // to serve the app