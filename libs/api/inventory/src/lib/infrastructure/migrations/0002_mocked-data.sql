ALTER TABLE warehouse RENAME COLUMN "clientId" TO client_id;
ALTER TABLE warehouse_operator RENAME COLUMN "locationId" TO location_id;
ALTER TABLE warehouse_operator RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE warehouse_operator ALTER COLUMN created_at SET DEFAULT NOW();

INSERT INTO client (id, name)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ACME Corp'),
  ('22222222-2222-2222-2222-222222222222', 'Globex Inc');

INSERT INTO warehouse (id, address, name, client_id)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Main Street 1, Warsaw',
    'Warsaw Warehouse',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Industrial Ave 42, Krakow',
    'Krakow Warehouse',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Logistics Park 7, Berlin',
    'Berlin Warehouse',
    '22222222-2222-2222-2222-222222222222'
  );

INSERT INTO warehouse_operator (id, location_id, name)
VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Jan Kowalski'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Anna Nowak'
  );

INSERT INTO inventory_stock (
  id,
  item_sku,
  quantity,
  version,
  location,
  updated_at
)
VALUES
  (
    '11111111-aaaa-bbbb-cccc-111111111111',
    'SKU-APPLE-001',
    100,
    1,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Warsaw Warehouse
    NOW()
  ),
  (
    '22222222-aaaa-bbbb-cccc-222222222222',
    'SKU-BANANA-001',
    50,
    1,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NOW()
  ),
  (
    '33333333-aaaa-bbbb-cccc-333333333333',
    'SKU-APPLE-001',
    200,
    1,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Krakow Warehouse
    NOW()
  ),
  (
    '44444444-aaaa-bbbb-cccc-444444444444',
    'SKU-ORANGE-001',
    75,
    1,
    'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Berlin Warehouse
    NOW()
  );
