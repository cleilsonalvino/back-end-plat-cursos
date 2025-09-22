import 'dotenv/config';
import { prisma } from './prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  // 1) Instrutor
  const email = 'instrutor@ajafs.com.br';
  const passwordHash = await bcrypt.hash('123456', 10);

  const instructor = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: 'Instrutor AJAFS', email, passwordHash, role: 'INSTRUCTOR' }
  });

  // 2) Curso (sem criar módulo/aulas aninhadas ainda)
  const course = await prisma.course.upsert({
    where: { slug: 'marketing-digital-basico' },
    update: {},
    create: {
      slug: 'marketing-digital-basico',
      title: 'Marketing Digital Básico',
      description: 'Fundamentos aplicados para empreendedores.',
      category: 'Marketing',
      level: 'iniciante',
      priceCents: 0,
      instructorId: instructor.id,
      visibility: 'PUBLIC'
    }
  });

  // 3) Módulo do curso
  const module = await prisma.module.upsert({
    where: { id: 'seed-mod-intro' }, // chave estável só pro upsert; poderia usar findFirst + create também
    update: {},
    create: {
      id: 'seed-mod-intro',
      courseId: course.id,
      title: 'Introdução',
      position: 1
    }
  });

  // 4) Aula — informando courseId E moduleId
  await prisma.lesson.upsert({
    where: { id: 'seed-lesson-boas-vindas' },
    update: {},
    create: {
      id: 'seed-lesson-boas-vindas',
      courseId: course.id,
      moduleId: module.id,
      title: 'Boas-vindas',
      videoUrl: 'https://example.com/v1',
      durationS: 300,
      position: 1,
      resources: []
    }
  });

  console.log('Seed OK:', { instructor: instructor.email, course: course.slug });
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
