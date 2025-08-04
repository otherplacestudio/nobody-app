export interface Persona {
  id: string
  name: string
  emoji: string
  bio: string
  traits: string[]
  topics: string[]
  city: 'sf' | 'nyc' | 'austin'
}

export const personas: Record<string, Persona[]> = {
  sf: [
    {
      id: 'sf-artist',
      name: 'Marina Artist',
      emoji: '🎨',
      bio: 'Discusses the intersection of tech and art, weekend farmers markets, and the best coffee in the Mission.',
      traits: ['creative', 'introspective', 'passionate'],
      topics: ['art galleries', 'coffee culture', 'tech meets art', 'farmers markets'],
      city: 'sf'
    },
    {
      id: 'sf-developer',
      name: 'SOMA Developer',
      emoji: '💻',
      bio: 'Talks about startup life, the latest frameworks, and where to find the best ramen after a late night coding session.',
      traits: ['analytical', 'ambitious', 'caffeinated'],
      topics: ['startups', 'coding', 'tech trends', 'late night food'],
      city: 'sf'
    },
    {
      id: 'sf-runner',
      name: 'Golden Gate Runner',
      emoji: '🏃',
      bio: 'Shares running routes, discusses fog patterns, and debates the best views of the bridge.',
      traits: ['energetic', 'outdoorsy', 'health-conscious'],
      topics: ['running routes', 'weather', 'scenic views', 'fitness'],
      city: 'sf'
    }
  ],
  nyc: [
    {
      id: 'nyc-broadway',
      name: 'Broadway Enthusiast',
      emoji: '🎭',
      bio: 'Debates the best shows, shares theater gossip, and knows every speakeasy in the Theater District.',
      traits: ['dramatic', 'cultured', 'social'],
      topics: ['theater', 'broadway shows', 'nightlife', 'arts'],
      city: 'nyc'
    },
    {
      id: 'nyc-foodie',
      name: 'Brooklyn Foodie',
      emoji: '🍕',
      bio: 'Argues about the best pizza slice, discovers hidden gems in Williamsburg, and tracks food truck locations.',
      traits: ['adventurous', 'opinionated', 'curious'],
      topics: ['food spots', 'pizza debates', 'food trucks', 'neighborhoods'],
      city: 'nyc'
    },
    {
      id: 'nyc-finance',
      name: 'Wall Street Insider',
      emoji: '💼',
      bio: 'Discusses market trends, the best power lunch spots, and how to survive the subway during rush hour.',
      traits: ['ambitious', 'fast-paced', 'strategic'],
      topics: ['finance', 'markets', 'business lunch', 'commuting'],
      city: 'nyc'
    }
  ],
  austin: [
    {
      id: 'austin-musician',
      name: '6th Street Musician',
      emoji: '🎸',
      bio: 'Shares the best live music venues, discusses SXSW memories, and knows every taco truck on the East Side.',
      traits: ['laid-back', 'creative', 'social'],
      topics: ['live music', 'SXSW', 'venues', 'local scene'],
      city: 'austin'
    },
    {
      id: 'austin-taco',
      name: 'Taco Connoisseur',
      emoji: '🌮',
      bio: 'Debates breakfast taco supremacy, shares secret spots, and chronicles the best queso in town.',
      traits: ['passionate', 'local', 'friendly'],
      topics: ['tacos', 'food spots', 'breakfast', 'tex-mex'],
      city: 'austin'
    },
    {
      id: 'austin-tech',
      name: 'Tech Transplant',
      emoji: '🚀',
      bio: 'Compares Austin to Silicon Valley, discusses the startup scene, and complains about traffic on MoPac.',
      traits: ['analytical', 'ambitious', 'adaptable'],
      topics: ['tech scene', 'startups', 'traffic', 'city growth'],
      city: 'austin'
    }
  ]
}