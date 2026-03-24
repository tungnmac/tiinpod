-- Migration Version: 002
-- Description: Create product_views table for multi-angle design support

CREATE TABLE IF NOT EXISTS "product_views" (
    "id" BIGSERIAL PRIMARY KEY,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,
    "product_template_id" BIGINT REFERENCES "product_templates"("id") ON DELETE CASCADE,
    "view_name" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_product_views_product_template_id" ON "product_views" ("product_template_id");
CREATE INDEX IF NOT EXISTS "idx_product_views_deleted_at" ON "product_views" ("deleted_at");
