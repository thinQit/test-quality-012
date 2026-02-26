import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.admin,
      passwordHash
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Customer One',
      role: UserRole.customer,
      passwordHash
    }
  });

  const itemsData = Array.from({ length: 15 }).map((_, index) => ({
    name: `Sample Item ${index + 1}`,
    description: `This is a description for sample item ${index + 1}.`,
    ownerId: index % 2 === 0 ? admin.id : customer.id
  }));

  await prisma.item.createMany({ data: itemsData });

  const recentItems = [
    { name: 'Recent Item A', description: 'Recently created item A', ownerId: admin.id },
    { name: 'Recent Item B', description: 'Recently created item B', ownerId: customer.id },
    { name: 'Recent Item C', description: 'Recently created item C', ownerId: admin.id },
    { name: 'Recent Item D', description: 'Recently created item D', ownerId: customer.id },
    { name: 'Recent Item E', description: 'Recently created item E', ownerId: admin.id }
  ];

  for (const item of recentItems) {
    await prisma.item.create({ data: item });
  }
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
