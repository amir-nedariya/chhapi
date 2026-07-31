import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const users = [
    {
      name: 'Mohammad Yunus',
      mobile: '9999999999',
      password,
      role: 'SUPER_ADMIN',
    },
    {
      name: 'akil',
      mobile: '6356417253',
      password,
      role: 'SUPER_ADMIN',
    },
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { mobile: user.mobile }
    });

    if (!exists) {
      await prisma.user.create({ data: user });
      console.log(`Created ${user.role}`);
    } else {
      console.log(`${user.role} already exists`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
