-- CreateTable
CREATE TABLE "Product" (
    "slug" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "subtitle" TEXT,
    "price" DOUBLE PRECISION,
    "original_price" DOUBLE PRECISION,
    "description" TEXT,
    "size" JSON,
    "image" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Thumbnail" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "productSlug" BIGINT,

    CONSTRAINT "Thumbnail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Thumbnail_id_key" ON "Thumbnail"("id");

-- AddForeignKey
ALTER TABLE "Thumbnail" ADD CONSTRAINT "Thumbnail_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "Product"("slug") ON DELETE CASCADE ON UPDATE NO ACTION;
