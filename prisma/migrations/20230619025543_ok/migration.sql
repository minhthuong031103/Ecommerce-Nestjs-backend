-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" BIGINT;

-- CreateTable
CREATE TABLE "Category" (
    "slug" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("slug") ON DELETE SET NULL ON UPDATE NO ACTION;
