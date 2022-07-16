# Discord Challenge Based Reward System Bot

<hr>

## Getting started


### Installation:

```shell
git clone https://github.com/salahmak/reward-system-discord-bot
cd reward-system-discord-bot
yarn #or npm install, to install dependencies
```

### Setup:

Before you start the bot, make sure to create a ".env" file and write the required tokens and keys for the bot to work

```shell
cp .env.example .env #to create a template .env file that you'll have to fill yourself
```

#### Requirments:

<ul>
    <li>Discord bot token (make sure to enable all Intents).</li>
    <li>Mongodb database</li>
    <li>Prefix: set it in the .env file</li>
</ul>

## Commands


<table>
   <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Usage</th>
      <th>Aliases</th>
   </tr>
   <tr style="text-align: center">
      <td>help</td>
      <td style="text-align: center">guild</td>
      <td style="text-align: center">shows helpful information about all available commands</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; help</code>: Shows name and description of all commands in a single large embed.</li>
            <br/>
            <li><code>&lt;pfx&gt; help &lt;command&gt;</code>: Shows name, description, usage and aliases of a specific 
               command.
            </li>
         </ul>
      </td>
      <td style="text-align: center">
         h
      </td>
   </tr>
   <tr style="text-align: center">
      <td>ping</td>
      <td style="text-align: center">guild</td>
      <td style="text-align: center">prints the response latency from the server</td>
      <td style="text-align: center">
         <code> &lt;pfx&gt; ping</code>
      </td>
      <td style="text-align: center">
         N/A
      </td>
   </tr>
   <tr style="text-align: center">
      <td>award</td>
      <td style="text-align: center">ranking</td>
      <td style="text-align: center">used to grant users awards when completing a challenge</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; award @user1 @user2 ... @userN  &lt;amount:uint&gt;</code>: Gives the mentioned users the 
               specified amount of points.
            </li>
            <br/>
            <li><code> &lt;pfx&gt; award @user1 @user2 ... @userN  &lt;challengeName:string&gt;</code>: Gives the mentioned users the amount of points that the specified challenge awards. </li>
         </ul>
      </td>
      <td style="text-align: center">
         reward
      </td>
   </tr>
   <tr style="text-align: center">
      <td>remove</td>
      <td style="text-align: center">ranking</td>
      <td style="text-align: center">used to remove awards from users</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; remove @user1 @user2 ... @userN  &lt;amount:uint&gt;</code>: takes back from the mentioned users the 
               specified amount of points.
            </li>
            <br/>
            <li><code> &lt;pfx&gt; remove @user1 @user2 ... @userN  &lt;challengeName:string&gt;</code>: takes back from the mentioned users the amount of points that the specified challenge had awarded them. </li>
         </ul>
      </td>
      <td style="text-align: center">
         rm
      </td>
   </tr>
   <tr style="text-align: center">
      <td>profile</td>
      <td style="text-align: center">ranking</td>
      <td style="text-align: center">Shows the score and number of solved challenges of a user</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; profile</code>: Shows the statistics of the user who issued the command.</li>
            <br/>
            <li><code> &lt;pfx&gt; profile @user  &lt;challengeName:string&gt;</code>: Shows the statistics of @user </li>
         </ul>
      </td>
      <td style="text-align: center">
         p
      </td>
   </tr>
   <tr style="text-align: center">
      <td>leaderboard</td>
      <td style="text-align: center">ranking</td>
      <td style="text-align: center">Shows top 10 users sorted by amount of points</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; leaderboard</code></li>
            <br/>
         </ul>
      </td>
      <td style="text-align: center">
         lb
      </td>
   </tr>
   <tr style="text-align: center">
      <td>challenges</td>
      <td style="text-align: center">challenges</td>
      <td style="text-align: center">Allows adding, removing, editing and listing challenges</td>
      <td style="text-align: center">
         <ul>
            <li><code> &lt;pfx&gt; challenges add &lt;challengeName:string&gt; &lt;award:uint&gt;</code></li>
            <br/>
            <li><code> &lt;pfx&gt; challenges edit &lt;challengeName:string&gt; &lt;newAward:uint&gt;</code></li>
            <br/>
            <li><code> &lt;pfx&gt; challenges remove &lt;challengeName:string&gt;</code></li>
            <br/>
            <li><code> &lt;pfx&gt; challenges list </code></li>
            <br/>
         </ul>
      </td>
      <td style="text-align: center">
         ch, challenge
      </td>
   </tr>
</table>

