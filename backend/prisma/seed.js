const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const user = await prisma.user.upsert({
    where: { email: 'admin@flowboard.local' },
    update: {},
    create: {
      email: 'admin@flowboard.local',
      passwordHash: '$2b$10$8k0oxUBEnHBH9/gi1aSnx.8s3BpsDbkb1DYavYZDorKxTARp4ofY.',
      name: 'Admin',
    },
  });

  let project = await prisma.project.findFirst({ where: { title: 'Demo Project' } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        title: 'Demo Project',
        description: 'A seeded demo project',
        ownerId: user.id,
      },
    });
  }

  let board = await prisma.board.findFirst({ where: { title: 'Demo Board', projectId: project.id } });
  if (!board) {
    board = await prisma.board.create({ data: { title: 'Demo Board', projectId: project.id } });
  }

  await prisma.task.createMany({
    data: [
      { title: 'Define MVP', description: 'Outline core features', boardId: board.id },
      { title: 'Design mockups', description: 'Create UI mockups', boardId: board.id },
      { title: 'Setup CI', description: 'Configure CI pipelines', boardId: board.id },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
