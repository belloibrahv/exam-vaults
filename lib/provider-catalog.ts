import { prisma } from './prisma';

export interface HomeProvider {
  id: string;
  displayName: string;
  slug: string;
  color: string;
  description: string;
  certifications: Array<{ id: string }>;
}

export interface CatalogProvider {
  id: string;
  displayName: string;
  slug: string;
  color: string;
  certifications: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    difficulty: number;
    questionCount: number;
    examDuration: number;
    passingScore: number;
    level: {
      displayName: string;
      order: number;
    };
  }>;
}

export interface ProviderDetail {
  id: string;
  slug: string;
  color: string;
  website: string;
  description: string;
  displayName: string;
  certifications: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    difficulty: number;
    questionCount: number;
    examDuration: number;
    passingScore: number;
    examCost: number | null;
    recommendedExp: string | null;
    level: {
      name: string;
      displayName: string;
      color: string;
      order: number;
    };
    _count: {
      questions: number;
    };
  }>;
}

type ProviderDelegate = {
  findFirst: (args: unknown) => Promise<unknown>;
  findMany: (args: unknown) => Promise<unknown>;
};

function getProviderDelegate(): ProviderDelegate | null {
  const delegate = (prisma as unknown as { provider?: ProviderDelegate }).provider;

  if (!delegate) {
    return null;
  }

  if (typeof delegate.findMany !== 'function' || typeof delegate.findFirst !== 'function') {
    return null;
  }

  return delegate;
}

export async function getHomeProviders(): Promise<HomeProvider[]> {
  const provider = getProviderDelegate();

  if (!provider) {
    return [];
  }

  try {
    return (await provider.findMany({
      where: { isActive: true },
      include: {
        certifications: {
          where: { isActive: true },
          select: { id: true },
        },
      },
      orderBy: { order: 'asc' },
    })) as HomeProvider[];
  } catch (error) {
    console.error('Provider catalog unavailable on home page:', error);
    return [];
  }
}

export async function getCatalogProviders(): Promise<CatalogProvider[]> {
  const provider = getProviderDelegate();

  if (!provider) {
    return [];
  }

  try {
    return (await provider.findMany({
      where: { isActive: true },
      include: {
        certifications: {
          where: { isActive: true },
          include: {
            level: true,
          },
          orderBy: [{ level: { order: 'asc' } }, { order: 'asc' }],
        },
      },
      orderBy: { order: 'asc' },
    })) as CatalogProvider[];
  } catch (error) {
    console.error('Provider catalog unavailable on providers page:', error);
    return [];
  }
}

export async function getProviderBySlug(slug: string): Promise<ProviderDetail | null> {
  const provider = getProviderDelegate();

  if (!provider) {
    return null;
  }

  try {
    return (await provider.findFirst({
      where: { slug, isActive: true },
      include: {
        certifications: {
          where: { isActive: true },
          include: {
            level: true,
            _count: {
              select: { questions: true },
            },
          },
          orderBy: [{ level: { order: 'asc' } }, { order: 'asc' }],
        },
      },
    })) as ProviderDetail | null;
  } catch (error) {
    console.error(`Provider catalog unavailable for slug "${slug}":`, error);
    return null;
  }
}
