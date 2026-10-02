CREATE TABLE `marketing_engagement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week_start` text NOT NULL,
	`posts_published` integer DEFAULT 0 NOT NULL,
	`comments` integer DEFAULT 0 NOT NULL,
	`messages` integer DEFAULT 0 NOT NULL,
	`new_followers` integer DEFAULT 0 NOT NULL,
	`reach` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`logged_by` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marketing_engagement_week_start_unique` ON `marketing_engagement` (`week_start`);--> statement-breakpoint
CREATE TABLE `marketing_partners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`facebook_url` text DEFAULT '' NOT NULL,
	`followers` integer DEFAULT 0 NOT NULL,
	`partner_type` text NOT NULL,
	`model` text NOT NULL,
	`referral_code` text,
	`status` text DEFAULT 'Prospect' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marketing_partners_referral_code_unique` ON `marketing_partners` (`referral_code`);--> statement-breakpoint
CREATE TABLE `marketing_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`routine_key` text,
	`assigned_to` text,
	`completed_by` text,
	`completed_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marketing_tasks_date_routine_idx` ON `marketing_tasks` (`date`,`routine_key`);--> statement-breakpoint
ALTER TABLE `leads` ADD `source` text DEFAULT 'Other' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `partner_id` text REFERENCES marketing_partners(id) ON DELETE set null;