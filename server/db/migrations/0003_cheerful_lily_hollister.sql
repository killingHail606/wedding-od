ALTER TABLE `guests` ADD `partner_first_name` text;--> statement-breakpoint
ALTER TABLE `guests` ADD `partner_last_name` text;--> statement-breakpoint
ALTER TABLE `rsvps` ADD `with_partner` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `rsvps` ADD `partner_first_name` text;--> statement-breakpoint
ALTER TABLE `rsvps` ADD `partner_last_name` text;