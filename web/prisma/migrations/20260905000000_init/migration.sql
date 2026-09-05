-- CreateTable
CREATE TABLE `admin_users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `preferred_contact` VARCHAR(191) NULL,
    `project_type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `location_suburb` VARCHAR(191) NULL,
    `location_region` VARCHAR(191) NULL,
    `street_address` VARCHAR(191) NULL,
    `project_stage` VARCHAR(191) NULL,
    `budget_range` VARCHAR(191) NULL,
    `timeframe` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `project_details` TEXT NULL,
    `message` TEXT NULL,
    `source` VARCHAR(191) NOT NULL,
    `landing_page` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NULL,
    `utm_medium` VARCHAR(191) NULL,
    `utm_campaign` VARCHAR(191) NULL,
    `utm_content` VARCHAR(191) NULL,
    `utm_term` VARCHAR(191) NULL,
    `gclid` VARCHAR(191) NULL,
    `fbclid` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'CONSULTATION_BOOKED', 'PROPOSAL', 'WON', 'LOST', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `consent` BOOLEAN NOT NULL DEFAULT false,
    `consent_at` DATETIME(3) NULL,
    `marketing_consent` BOOLEAN NOT NULL DEFAULT false,
    `marketing_consent_at` DATETIME(3) NULL,
    `is_synthetic` BOOLEAN NOT NULL DEFAULT false,
    `idempotency_key` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    UNIQUE INDEX `leads_reference_key`(`reference`),
    UNIQUE INDEX `leads_idempotency_key_key`(`idempotency_key`),
    INDEX `leads_status_created_at_idx`(`status`, `created_at`),
    INDEX `leads_email_idx`(`email`),
    INDEX `leads_is_synthetic_created_at_idx`(`is_synthetic`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `project_type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `completion_year` VARCHAR(191) NULL,
    `floor_area` VARCHAR(191) NULL,
    `bedrooms` VARCHAR(191) NULL,
    `bathrooms` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `architect` VARCHAR(191) NULL,
    `excerpt` TEXT NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `client_brief` TEXT NULL,
    `challenge` TEXT NULL,
    `solution` TEXT NULL,
    `design_approach` TEXT NULL,
    `construction_approach` TEXT NULL,
    `outcome` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `projects_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_images` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `kind` ENUM('HERO', 'GALLERY', 'BEFORE', 'AFTER') NOT NULL DEFAULT 'GALLERY',
    `alt` VARCHAR(191) NOT NULL,
    `src` VARCHAR(191) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL,
    `attribution` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NULL,
    `seo_title` VARCHAR(191) NULL,
    `seo_description` VARCHAR(191) NULL,

    UNIQUE INDEX `articles_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,

    UNIQUE INDEX `locations_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `hero` VARCHAR(191) NULL,
    `seo_title` VARCHAR(191) NULL,
    `seo_description` VARCHAR(191) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `services_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value_json` LONGTEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_images` ADD CONSTRAINT `project_images_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
