/*
  # SAP MM Demo - Purchase Order and Goods Receipt Tables

  1. New Tables
    - `purchase_orders`
      - `id` (bigserial, primary key)
      - `po_number` (text, unique) - Auto-generated PO number
      - `material_code` (text) - Material/Product code
      - `material_description` (text) - Material description
      - `quantity` (integer) - Ordered quantity
      - `vendor` (text) - Vendor name
      - `status` (text) - PO status (Open, Received, Closed)
      - `created_at` (timestamptz) - Creation timestamp
      
    - `goods_receipts`
      - `id` (bigserial, primary key)
      - `grn_number` (text, unique) - Goods Receipt Note number
      - `po_id` (bigint) - Foreign key to purchase_orders
      - `po_number` (text) - Reference to PO number
      - `received_quantity` (integer) - Quantity received
      - `status` (text) - GRN status (Posted)
      - `posting_date` (timestamptz) - Posting date
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (demo purposes)

  3. Notes
    - This is a demo/training system with simplified access controls
    - In production, proper authentication and authorization would be required
*/

CREATE TABLE IF NOT EXISTS purchase_orders (
  id bigserial PRIMARY KEY,
  po_number text UNIQUE NOT NULL,
  material_code text NOT NULL,
  material_description text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  vendor text NOT NULL,
  status text NOT NULL DEFAULT 'Open',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goods_receipts (
  id bigserial PRIMARY KEY,
  grn_number text UNIQUE NOT NULL,
  po_id bigint NOT NULL REFERENCES purchase_orders(id),
  po_number text NOT NULL,
  received_quantity integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Posted',
  posting_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to purchase orders"
  ON purchase_orders FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to purchase orders"
  ON purchase_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to purchase orders"
  ON purchase_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to goods receipts"
  ON goods_receipts FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to goods receipts"
  ON goods_receipts FOR INSERT
  WITH CHECK (true);