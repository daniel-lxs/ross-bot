export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      TOKEN: string;
      GUILD_ID: string;
      CHANNEL_ID: string;
      OWNER_ROLE_ID: string;
    }
  }
}
