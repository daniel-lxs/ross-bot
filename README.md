# RoSS - RSS to Discord Bot

RoSS (Really Simple Syndication to Discord Bot) is a Node.js application designed to fetch articles from RSS feeds and automatically post them to specified Discord channels.

## Features

- Fetch articles from multiple RSS feeds.
- Automatically post new articles to Discord channels.
- Easy to set up and configure with YAML files.
- Database migrations support for easy data management.
- Built with Discord.js for seamless integration with Discord API.

## Getting Started

These instructions will get you a copy of RoSS up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime.

### Installation

To set up RoSS, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/daniel-lxs/ross-bot.git
cd ross-bot
```

2. Install dependencies:

```bash
bun install
```

3. Create a `RSS.yaml` (If it doesn't exist already) file in the root directory with your RSS feeds.

4. Run the migrations to set up your database:

```bash
bun run run-migrations
```

### Usage

To start the bot in development mode, run:

```bash
bun run dev
```

For production, start the bot using:

```bash
bun run start
```

## Configuration

RoSS is configured using YAML files where the RSS feeds are stored.
A `.env.example` file is provided. You can specify the Discord bot token, RSS feed URLs, and the channel IDs where the articles should be posted in a `.env` file.

## Contributing

If you'd like to contribute to RoSS, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API.
- [rss-parser](https://www.npmjs.com/package/rss-parser) - A small library for turning RSS XML feeds into JavaScript objects.
- [drizzle-orm](https://www.npmjs.com/package/drizzle-orm) - A lightweight ORM for SQLite and other databases.
- [js-yaml](https://www.npmjs.com/package/js-yaml) - JavaScript parser and dumper for YAML files.
