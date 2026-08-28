import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Food/Edible Oil ERP database seed...');

  // Create default Edible Oil company
  const company = await prisma.company.upsert({
    where: { domain: 'oilerp.com' },
    update: {
      name: 'Apex Edible Oils & Foods Pvt Ltd',
    },
    create: {
      name: 'Apex Edible Oils & Foods Pvt Ltd',
      domain: 'oilerp.com',
    },
  });

  console.log(`🏢 Edible Oil Company initialized: ${company.name} (${company.id})`);

  // Create default department
  const dept = await prisma.department.upsert({
    where: { id: 'food-safety-dept' },
    update: {},
    create: {
      id: 'food-safety-dept',
      name: 'Food Safety & Edible Processing',
      companyId: company.id,
    },
  });

  // Seed default admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@oilerp.com' },
    update: {
      passwordHash: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      email: 'admin@oilerp.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.SUPER_ADMIN,
      companyId: company.id,
      departmentId: dept.id,
      isActive: true,
    },
  });

  console.log(`👤 Super Admin seeded: ${admin.email}`);

  // Seed other roles for testing
  const roles = [
    { email: 'finance@oilerp.com', role: UserRole.FINANCE_MANAGER, first: 'Finance', last: 'Manager', pass: 'Finance@123' },
    { email: 'production@oilerp.com', role: UserRole.PRODUCTION_MANAGER, first: 'Production', last: 'Manager', pass: 'Prod@123' },
    { email: 'warehouse@oilerp.com', role: UserRole.WAREHOUSE_OPERATOR, first: 'Warehouse', last: 'Operator', pass: 'Ware@123' },
  ];

  for (const u of roles) {
    const userPass = await bcrypt.hash(u.pass, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: userPass, role: u.role },
      create: {
        email: u.email,
        passwordHash: userPass,
        firstName: u.first,
        lastName: u.last,
        role: u.role,
        companyId: company.id,
        departmentId: dept.id,
        isActive: true,
      },
    });
    console.log(`👤 User seeded: ${u.email} (${u.role})`);
  }

  // Seed Edible Oil Raw Materials (Crude Soyabean, Mustard Seeds, Crude Palm)
  const crudeSoyabean = await prisma.rawMaterial.upsert({
    where: { sku: 'RM-CRUDE-SOYA' },
    update: {},
    create: {
      sku: 'RM-CRUDE-SOYA',
      name: 'Crude Soyabean Degummed Oil',
      type: 'CRUDE_OIL',
      unit: 'Liters',
      minStock: 20000,
      currentStock: 150000,
      companyId: company.id,
    },
  });

  const mustardSeeds = await prisma.rawMaterial.upsert({
    where: { sku: 'RM-MUSTARD-SEED' },
    update: {},
    create: {
      sku: 'RM-MUSTARD-SEED',
      name: 'Mustard Seeds (Black/Yellow Grade A)',
      type: 'CHEMICAL_ADDITIVE',
      unit: 'KG',
      minStock: 10000,
      currentStock: 85000,
      companyId: company.id,
    },
  });

  console.log(`🥦 Edible Raw Materials Seeded: ${crudeSoyabean.name}, ${mustardSeeds.name}`);

  // Seed Edible Finished Products (Pouches, Cans, Tins)
  const soyaPouch = await prisma.finishedProduct.upsert({
    where: { sku: 'FP-SOYA-1L-POUCH' },
    update: {},
    create: {
      sku: 'FP-SOYA-1L-POUCH',
      name: 'Refined Soyabean Oil 1L Pouch (Fortune Grade)',
      packageSize: '1L Pouch',
      unitPrice: 125,
      currentStock: 5000,
      companyId: company.id,
    },
  });

  const mustardTin = await prisma.finishedProduct.upsert({
    where: { sku: 'FP-MUSTARD-15L-TIN' },
    update: {},
    create: {
      sku: 'FP-MUSTARD-15L-TIN',
      name: 'Kachi Ghani Mustard Oil 15L Tin',
      packageSize: '15L Tin',
      unitPrice: 1950,
      currentStock: 1200,
      companyId: company.id,
    },
  });

  console.log(`📦 Edible Finished Products Seeded: ${soyaPouch.name}, ${mustardTin.name}`);

  // Seed Food-Grade Storage Tanks
  await prisma.storageTank.upsert({
    where: { tankNumber: 'TANK-EDIBLE-01' },
    update: {},
    create: {
      tankNumber: 'TANK-EDIBLE-01',
      capacityLiters: 100000,
      currentLevelLiters: 65000,
      oilType: 'Crude Degummed Soyabean Oil',
      status: 'STORAGE',
      companyId: company.id,
    },
  });

  await prisma.storageTank.upsert({
    where: { tankNumber: 'TANK-EDIBLE-02' },
    update: {},
    create: {
      tankNumber: 'TANK-EDIBLE-02',
      capacityLiters: 75000,
      currentLevelLiters: 42000,
      oilType: 'Refined Palm Olein (Cooking Grade)',
      status: 'REFINING',
      companyId: company.id,
    },
  });

  console.log('✅ Edible Oil Food Industry Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
