-- Add optional username with uniqueness for users
ALTER TABLE "User" ADD COLUMN     "username" TEXT;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
