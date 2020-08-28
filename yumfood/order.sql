CREATE TABLE IF NOT EXISTS orders (
    id INTEGER NOT NULL PRIMARY KEY autoincrement, 
    tag_id INTEGER NOT NULL, 
    vendor_id INTEGER NOT NULL,
    user_id  INTEGER NOT NULL,
    qty INTEGER NOT NULL, 
    note TEXT,
    created_at datetime null,
    updated_at datetime null
);

INSERT INTO orders (tag_id, vendor_id, user_id, qty, note, created_at, updated_at) 
VALUES (10, 10, 2, 2, 'chilli sauce', datetime('now'), datetime('now')); 