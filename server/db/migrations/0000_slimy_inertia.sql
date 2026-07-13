CREATE TABLE `guests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`invited_to_ceremony` integer DEFAULT false NOT NULL,
	`note` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guests_token_unique` ON `guests` (`token`);--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guest_id` integer,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`attending` integer NOT NULL,
	`with_children` integer DEFAULT false NOT NULL,
	`children_count` integer DEFAULT 0 NOT NULL,
	`allergies` text,
	`comment` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` integer PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
