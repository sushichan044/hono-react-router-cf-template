PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rate_limits` (
	`count` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`last_request` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rate_limits`("count", "id", "key", "last_request") SELECT "count", "id", "key", "last_request" FROM `rate_limits`;--> statement-breakpoint
DROP TABLE `rate_limits`;--> statement-breakpoint
ALTER TABLE `__new_rate_limits` RENAME TO `rate_limits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `rate_limits_key_unique` ON `rate_limits` (`key`);