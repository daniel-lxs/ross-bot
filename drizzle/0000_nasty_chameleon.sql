CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`externalId` text,
	`title` text,
	`categories` text,
	`content` text,
	`source` text,
	`url` text,
	`postedOn` integer
);
--> statement-breakpoint
CREATE TABLE `config` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`value` text
);
