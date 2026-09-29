CREATE TABLE `contact_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_id` text NOT NULL,
	`date` text NOT NULL,
	`author` text NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text NOT NULL,
	`location` text NOT NULL,
	`vehicle_brands` text DEFAULT '[]' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`location` text NOT NULL,
	`vehicle_brand` text NOT NULL,
	`parts_needed` text NOT NULL,
	`estimated_value` integer NOT NULL,
	`assigned_to` text NOT NULL,
	`stage` text DEFAULT 'New Lead' NOT NULL,
	`created_at` text NOT NULL,
	`last_updated` text NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_id` text NOT NULL,
	`date` text NOT NULL,
	`item` text NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`location` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_name_unique` ON `staff` (`name`);