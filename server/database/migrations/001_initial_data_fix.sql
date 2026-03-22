-- Xử lý table users
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
        UPDATE users SET username = email WHERE username IS NULL OR username = '';
    END IF;
END $$;

-- Xử lý table orders
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='orders') THEN
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);
        UPDATE orders SET order_number = 'ORD-' || id || '-' || floor(extract(epoch from now())) WHERE order_number IS NULL OR order_number = '';
    END IF;
END $$;

-- Xử lý table inventories
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='inventories') THEN
        ALTER TABLE inventories ADD COLUMN IF NOT EXISTS status VARCHAR(50);
        UPDATE inventories SET status = 'in_stock' WHERE status IS NULL OR status = '';
    END IF;
END $$;
