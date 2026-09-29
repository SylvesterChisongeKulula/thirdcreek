ALTER TABLE `staff` ADD `auth_role` text DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` ADD `password_hash` text;