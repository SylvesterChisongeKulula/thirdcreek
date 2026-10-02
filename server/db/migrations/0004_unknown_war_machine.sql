CREATE TABLE `marketing_day_themes` (
	`weekday` integer PRIMARY KEY NOT NULL,
	`theme` text NOT NULL,
	`example` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marketing_playbook_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`details` text DEFAULT '{}' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marketing_routine_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`weekday` integer,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`link` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `marketing_tasks` ADD `link` text;