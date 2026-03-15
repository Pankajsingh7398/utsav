export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "default-secret-key",
  databaseUrl: process.env.DATABASE_URL ?? "mongodb://localhost:27017/utsavmitra",
  isProduction: process.env.NODE_ENV === "production",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@utsavmitra.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin123",
  ownerName: process.env.OWNER_NAME ?? "Pankaj Singh",
};
