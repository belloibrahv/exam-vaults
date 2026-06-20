import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LessonReaderClient from '@/components/LessonReaderClient';

interface LessonPageProps {
  params: {
    slug: string;
    lessonSlug: string;
  };
}

// Custom Markdown parser implementation to generate styled HTML
function parseMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle empty line
    if (!line) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = null;
      }
      if (inTable) {
        html += '</tbody></table></div>';
        inTable = false;
      }
      continue;
    }

    // Handle Headings
    if (line.startsWith('# ')) {
      html += `<h1 class="text-3xl font-extrabold text-techvaults-black mt-8 mb-4 pb-2 border-b border-techvaults-gray-200">${line.substring(2)}</h1>`;
      continue;
    }
    if (line.startsWith('## ')) {
      html += `<h2 class="text-2xl font-bold text-techvaults-black mt-8 mb-3">${line.substring(3)}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) {
      html += `<h3 class="text-xl font-bold text-techvaults-black mt-6 mb-2">${line.substring(4)}</h3>`;
      continue;
    }

    // Handle horizontal rule
    if (line === '---') {
      html += '<hr class="my-8 border-techvaults-gray-200" />';
      continue;
    }

    // Handle tables
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        html += '<div class="overflow-x-auto my-6 border border-techvaults-gray-200 rounded-xl shadow-sm"><table class="min-w-full divide-y divide-techvaults-gray-200 text-sm text-left"><thead class="bg-techvaults-gray-50 text-techvaults-black font-semibold uppercase tracking-wider">';
        const cols = line.split('|').map(c => c.trim()).filter(c => c);
        html += '<tr>';
        cols.forEach(col => {
          html += `<th class="px-6 py-3 border-b border-techvaults-gray-200 font-bold">${col}</th>`;
        });
        html += '</tr></thead><tbody class="divide-y divide-techvaults-gray-200 bg-white">';
      } else {
        if (line.includes('---')) continue;
        const cols = line.split('|').map(c => c.trim()).filter(c => c);
        html += '<tr class="hover:bg-techvaults-gray-50 transition-colors">';
        cols.forEach(col => {
          html += `<td class="px-6 py-4 text-techvaults-gray-700">${col}</td>`;
        });
        html += '</tr>';
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table></div>';
      inTable = false;
    }

    // Handle lists
    const isUnordered = line.startsWith('* ') || line.startsWith('- ');
    const isOrdered = /^\d+\.\s/.test(line);

    if (isUnordered || isOrdered) {
      const currentListType = isUnordered ? 'ul' : 'ol';
      const content = isUnordered ? line.substring(2) : line.replace(/^\d+\.\s/, '');

      if (!inList) {
        inList = true;
        listType = currentListType;
        html += currentListType === 'ul' ? '<ul class="list-disc pl-6 my-4 space-y-2 text-techvaults-gray-700">' : '<ol class="list-decimal pl-6 my-4 space-y-2 text-techvaults-gray-700">';
      } else if (listType !== currentListType) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        listType = currentListType;
        html += currentListType === 'ul' ? '<ul class="list-disc pl-6 my-4 space-y-2 text-techvaults-gray-700">' : '<ol class="list-decimal pl-6 my-4 space-y-2 text-techvaults-gray-700">';
      }

      // Inline styles for list items
      const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-techvaults-black">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-techvaults-gray-100 border border-techvaults-gray-200 rounded font-mono text-xs text-techvaults-red">$1</code>');

      html += `<li>${formattedContent}</li>`;
      continue;
    } else if (inList) {
      html += listType === 'ul' ? '</ul>' : '</ol>';
      inList = false;
      listType = null;
    }

    // Handle standard paragraph text
    const formattedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-techvaults-black">$1</strong>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-techvaults-gray-100 border border-techvaults-gray-200 rounded font-mono text-xs text-techvaults-red">$1</code>');

    html += `<p class="my-4 text-techvaults-gray-700 leading-relaxed text-base md:text-lg">${formattedLine}</p>`;
  }

  if (inList) {
    html += listType === 'ul' ? '</ul>' : '</ol>';
  }
  if (inTable) {
    html += '</tbody></table></div>';
  }

  return html;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  // Fetch certification with provider details
  const certification = await prisma.certification.findUnique({
    where: { slug: params.slug },
    include: {
      provider: true,
    },
  });

  if (!certification) {
    notFound();
  }

  // Fetch all modules and lessons for sidebar outline
  const modules = await prisma.learningModule.findMany({
    where: { certificationId: certification.id },
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // Flat list of all lessons in order to find current, prev, and next
  const allLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      certificationSlug: certification.slug,
    }))
  );

  const currentLesson = allLessons.find((l) => l.slug === params.lessonSlug);

  if (!currentLesson) {
    notFound();
  }

  const currentIdx = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const previousLessonUrl = prevLesson ? `/learning/${certification.slug}/${prevLesson.slug}` : null;
  const nextLessonUrl = nextLesson ? `/learning/${certification.slug}/${nextLesson.slug}` : null;

  // Get user's completed lessons for sidebar checkboxes
  const completedProgress = await prisma.userLessonProgress.findMany({
    where: {
      userId: session.user.id,
      completed: true,
      lesson: {
        module: {
          certificationId: certification.id,
        },
      },
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = completedProgress.map((p) => p.lessonId);
  const parsedContentHtml = parseMarkdownToHtml(currentLesson.content);

  return (
    <LessonReaderClient
      certification={certification}
      modules={modules}
      currentLesson={currentLesson}
      initialCompletedLessonIds={completedLessonIds}
      previousLessonUrl={previousLessonUrl}
      nextLessonUrl={nextLessonUrl}
      parsedContentHtml={parsedContentHtml}
    />
  );
}
