-- Set natalie.hoang91@gmail.com as super_admin (global admin)
-- Run: npx prisma db execute --file scripts/set-super-admin.sql

UPDATE "User"
SET role = 'super_admin'
WHERE email = 'natalie.hoang91@gmail.com';
