import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const users = [
    {
      name: 'Mohammad Yunus',
      mobile: '9999999999',
      email: 'iaamir615@gmail.com',
      password,
      role: 'SUPER_ADMIN',
    }
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { mobile: user.mobile }
    });

    if (!exists) {
      await prisma.user.create({ data: user });
      console.log(`Created ${user.role}`);
    } else {
      if (!exists.email) {
        await prisma.user.update({
          where: { id: exists.id },
          data: { email: user.email }
        });
        console.log(`Updated email for ${user.role}`);
      } else {
        console.log(`${user.role} already exists with email ${exists.email}`);
      }
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
