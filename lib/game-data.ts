export interface Product {
  id: string;
  name: string;
  description: string;
  marketValue: number;
  hardMinimum: number;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Personality {
  id: string;
  name: string;
  label: string;
  description: string;
  prompt: string;
  patienceMultiplier: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'midnight-motor-club',
    name: 'Midnight Motor-Club',
    description: 'A massive, intricate luxury car garage featuring neon lights and miniature sports cars.',
    marketValue: 249.99,
    hardMinimum: 185.00,
    image: 'https://ik.imagekit.io/DEMOPROJECT/midnight_motor.png',
    difficulty: 'Easy'
  },
  {
    id: 'botanical-zen-garden',
    name: 'Botanical Zen Garden',
    description: 'A highly detailed traditional Japanese garden with a miniature cherry blossom tree and pagoda.',
    marketValue: 129.99,
    hardMinimum: 95.00,
    image: 'https://ik.imagekit.io/DEMOPROJECT/botanical_zen.png',
    difficulty: 'Medium'
  },
  {
    id: 'deep-space-rig',
    name: 'Deep Space Mining Rig',
    description: 'A huge, complex sci-fi industrial rig with exposed gears, glass canopies, and thrusters.',
    marketValue: 799.99,
    hardMinimum: 620.00,
    image: 'https://ik.imagekit.io/DEMOPROJECT/deep_space_rig.png',
    difficulty: 'Hard'
  }
];



export const PERSONALITIES: Personality[] = [
  {
    id: 'friendly',
    name: 'The Hobbyist',
    label: 'Friendly & Casual',
    description: 'An old collector who values a good home for their bricks more than top dollar.',
    patienceMultiplier: 1.5,
    prompt: 'You are "The Hobbyist", a kind, elderly brick collector. You are firm but polite. You value sentimentality. If the player is respectful or mentions a good reason for wanting the set (like for family), you are more likely to drop your price closer to your minimum.'
  },
  {
    id: 'stubborn',
    name: 'The Scalper',
    label: 'Stubborn & Greedy',
    description: 'A professional reseller who knows exactly what it\'s worth. Lowballs will offend them.',
    patienceMultiplier: 0.7,
    prompt: 'You are "The Scalper", a no-nonsense professional reseller. You are slightly arrogant and very impatient. You hate "lowball" offers and will walk away quickly if the player is not serious. You rarely go much below market value unless pushed with strong logic.'
  },
  {
    id: 'balanced',
    name: 'The Shopkeep',
    label: 'Professional & Fair',
    description: 'A local brick store owner. Reasonable but has bills to pay.',
    patienceMultiplier: 1.0,
    prompt: 'You are "The Shopkeep", a fair but firm business owner. You use logic and market comparisons. You are willing to negotiate but you have clear margins to maintain.'
  }
];
