# Screeps Typescript Starter

Screeps Typescript Starter is a starting point for a Screeps AI written in Typescript. It provides everything you need to start writing your AI whilst leaving `main.ts` as empty as possible.

## Basic Usage

You will need:

- [Node.JS](https://nodejs.org/en/download) (10.x || 12.x)
- A Package Manager ([Yarn](https://yarnpkg.com/en/docs/getting-started) or [npm](https://docs.npmjs.com/getting-started/installing-node))
- Rollup CLI (Optional, install via `npm install -g rollup`)

Download the latest source [here](https://github.com/screepers/screeps-typescript-starter/archive/master.zip) and extract it to a folder.

Open the folder in your terminal and run your package manager to install the required packages and TypeScript declaration files:

```bash
# npm
npm install

# yarn
yarn
```

Fire up your preferred editor with typescript installed and you are good to go!

### Rollup and code upload

Screeps Typescript Starter uses rollup to compile your typescript and upload it to a screeps server.

Move or copy `screeps.sample.json` to `screeps.json` and edit it, changing the credentials and optionally adding or removing some of the destinations.

Running `rollup -c` will compile your code and do a "dry run", preparing the code for upload but not actually pushing it. Running `rollup -c --environment DEST:main` will compile your code, and then upload it to a screeps server using the `main` config from `screeps.json`.

You can use `-cw` instead of `-c` to automatically re-run when your source code changes - for example, `rollup -cw --environment DEST:main` will automatically upload your code to the `main` configuration every time your code is changed.

Finally, there are also NPM scripts that serve as aliases for these commands in `package.json` for IDE integration. Running `npm run push-main` is equivalent to `rollup -c --environment DEST:main`, and `npm run watch-sim` is equivalent to `rollup -cw --dest sim`.

#### Important! To upload code to a private server, you must have [screepsmod-auth](https://github.com/ScreepsMods/screepsmod-auth) installed and configured!

## docker-compose

> Using https://github.com/screepers/screeps-launcher

There is [docker-compose.yml](docker-compose.yml) that starts a server + mongo.
This is the easiest way to get a private server mongo + redis.

1. Install [docker](https://docs.docker.com/install/) (look on the left to find the correct platform).
2. You might have to fiddle with the docker advanced settings to allow enough CPU to run the server smoothly.
3. Rename `server.config.example.yml` to `server.config.yml` and add your steam api key into line 1
4. Open a terminal and run `docker-compose up` to start the services. Wait until it is done starting the docker images and settle on mongo status messages.
5. Open another terminal in that folder. Run `docker-compose exec screeps screeps-launcher cli`. This is a command-line interface to control your new private server.
6. In the CLI, run `system.resetAllData()` to initialize the database. Unless you want to poke around, use `Ctrl-d` to exit the cli.
7. Run `docker-compose restart screeps` to reboot the private server.
8. Go to localhost:21025/authmod/password and set your password

Your server should be up and running! Connect to it using the steam client:

Choose the _Private Server_ tab and connect using those options:

- Host: _localhost_
- Port: _21025_
- Server password: _<leave blank, unless configured otherwise>_

## Typings

The type definitions for Screeps come from [typed-screeps](https://github.com/screepers/typed-screeps). If you find a problem or have a suggestion, please open an issue there.

## Documentation

We've also spent some time reworking the documentation from the ground-up, which is now generated through [Gitbooks](https://www.gitbook.com/). Includes all the essentials to get you up and running with Screeps AI development in TypeScript, as well as various other tips and tricks to further improve your development workflow.

Maintaining the docs will also become a more community-focused effort, which means you too, can take part in improving the docs for this starter kit.

To visit the docs, [click here](https://screepers.gitbook.io/screeps-typescript-starter/).

## Contributing

Issues, Pull Requests, and contribution to the docs are welcome! See our [Contributing Guidelines](CONTRIBUTING.md) for more details.
