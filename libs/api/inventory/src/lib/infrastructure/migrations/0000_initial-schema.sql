CREATE TYPE "public"."transaction_type" AS ENUM('INBOUND', 'TRANSFER');--> statement-breakpoint
CREATE TABLE "client" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_stock" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_sku" varchar(30) NOT NULL,
	"quantity" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"location" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_transaction" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_sku" varchar(30) NOT NULL,
	"quantity" integer NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"source_location" uuid,
	"target_location" uuid NOT NULL,
	"requested_by" uuid NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse_operator" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"locationId" uuid NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse" (
	"id" uuid PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"clientId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_location_warehouse_id_fk" FOREIGN KEY ("location") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transaction" ADD CONSTRAINT "inventory_transaction_source_location_warehouse_id_fk" FOREIGN KEY ("source_location") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transaction" ADD CONSTRAINT "inventory_transaction_target_location_warehouse_id_fk" FOREIGN KEY ("target_location") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transaction" ADD CONSTRAINT "inventory_transaction_requested_by_warehouse_operator_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."warehouse_operator"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_operator" ADD CONSTRAINT "warehouse_operator_locationId_warehouse_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_clientId_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_sku_location_idx" ON "inventory_stock" USING btree ("item_sku","location");--> statement-breakpoint
CREATE INDEX "item_sku_idx" ON "inventory_stock" USING btree ("item_sku");--> statement-breakpoint
CREATE INDEX "location_idx" ON "inventory_stock" USING btree ("location");