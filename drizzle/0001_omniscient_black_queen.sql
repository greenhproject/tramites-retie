CREATE TABLE `document_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`templateType` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`variables` json,
	`networkOperatorId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tramiteId` int,
	`projectId` int,
	`documentType` varchar(255) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`version` int NOT NULL DEFAULT 1,
	`uploadedById` int NOT NULL,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`tramiteId` int,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`attachments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `network_operators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255),
	`contactInfo` text,
	`requirements` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `network_operators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`relatedEntityType` varchar(100),
	`relatedEntityId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opensolar_sync_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` varchar(100) NOT NULL,
	`direction` enum('from_opensolar','to_opensolar') NOT NULL,
	`entityType` varchar(100),
	`entityId` varchar(255),
	`status` enum('success','error','pending') NOT NULL DEFAULT 'pending',
	`details` json,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `opensolar_sync_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opensolar_webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhookId` varchar(255),
	`eventType` varchar(100) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastTriggered` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opensolar_webhooks_id` PRIMARY KEY(`id`),
	CONSTRAINT `opensolar_webhooks_webhookId_unique` UNIQUE(`webhookId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openSolarId` varchar(255),
	`clientId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`systemCapacityKw` varchar(50),
	`status` varchar(100) NOT NULL DEFAULT 'draft',
	`networkOperatorId` int,
	`assignedEngineerId` int,
	`assignedAdvisorId` int,
	`technicalData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_openSolarId_unique` UNIQUE(`openSolarId`)
);
--> statement-breakpoint
CREATE TABLE `tramite_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tramiteId` int NOT NULL,
	`fromStatus` varchar(100),
	`toStatus` varchar(100) NOT NULL,
	`changedById` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tramite_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tramite_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('retie','operador','upme','otro') NOT NULL DEFAULT 'operador',
	`formTemplate` json,
	`workflowStates` json,
	`requiredDocuments` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tramite_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tramites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`tramiteTypeId` int NOT NULL,
	`status` varchar(100) NOT NULL DEFAULT 'borrador',
	`assignedToId` int,
	`formData` json,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`dueDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tramites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','cliente','ingeniero','asesor') NOT NULL DEFAULT 'cliente';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);