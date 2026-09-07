UPDATE products SET moderation_status = 'approved' WHERE moderation_status = 'pending';

ALTER TABLE products ALTER COLUMN moderation_status SET DEFAULT 'approved';
