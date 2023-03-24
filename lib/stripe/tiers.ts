type Price = {
  amount: number;
  priceIds: {
    test: string;
    production: string;
  };
};

export type Tier = 'free' | 'standard' | 'scale';

export type PricedModel = 'gpt-4' | 'gpt-3.5-turbo' | 'byo';

export const modelLabels: Record<PricedModel, string> = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'Chat',
  byo: 'BYO',
};

const env =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'production' : 'test';

export type TierPriceDetails = {
  name: string;
  quota: Record<PricedModel, number>;
  price?: {
    monthly?: Price;
    yearly: Price;
  };
};

export type TierDetails = {
  name: string;
  description: string;
  items: string[];
  prices: TierPriceDetails[];
};

export const getTierPriceDetailsFromPriceId = (
  priceId: string,
): TierPriceDetails | undefined => {
  for (const tier of Object.values(TIERS)) {
    for (const price of tier.prices) {
      if (
        price?.price?.monthly?.priceIds[env] === priceId ||
        price?.price?.yearly?.priceIds[env] === priceId
      ) {
        return price;
      }
    }
  }
  return undefined;
};

export const getTierDetailsFromPriceId = (
  priceId: string,
): TierDetails | undefined => {
  for (const tierDetail of Object.values(TIERS)) {
    for (const price of tierDetail.prices) {
      if (
        price?.price?.monthly?.priceIds[env] === priceId ||
        price?.price?.yearly?.priceIds[env] === priceId
      ) {
        return tierDetail;
      }
    }
  }
  return undefined;
};

export const isYearlyPrice = (priceId: string) => {
  for (const tierDetail of Object.values(TIERS)) {
    for (const price of tierDetail.prices) {
      if (price?.price?.yearly?.priceIds[env] === priceId) {
        return true;
      }
    }
  }
  return false;
};

export const getTierFromPriceId = (priceId: string): Tier | undefined => {
  for (const tier of Object.keys(TIERS) as Tier[]) {
    for (const price of TIERS[tier].prices) {
      if (
        price?.price?.monthly?.priceIds[env] === priceId ||
        price?.price?.yearly?.priceIds[env] === priceId
      ) {
        return tier;
      }
    }
  }
  return undefined;
};

export const comparePlans = (
  priceId: string,
  otherPriceId: string,
): -1 | 0 | 1 => {
  if (priceId === otherPriceId) {
    return 0;
  }
  // We assume that the TIERS list is ordered from lower to higher.
  for (const tierDetail of Object.values(TIERS)) {
    for (const price of tierDetail.prices) {
      const monthlyPriceId = price?.price?.monthly?.priceIds[env];
      const yearlyPriceId = price?.price?.yearly?.priceIds[env];
      if (
        (monthlyPriceId === priceId && yearlyPriceId === otherPriceId) ||
        (monthlyPriceId === otherPriceId && yearlyPriceId === priceId)
      ) {
        // Consider equal if one is yearly and other is monthly of
        // the same plan.
        return 0;
      }
      if (monthlyPriceId === priceId || yearlyPriceId === priceId) {
        // priceId came first in list, so it's lower
        return -1;
      }
      if (monthlyPriceId === otherPriceId || yearlyPriceId === otherPriceId) {
        // otherPriceId came first in list, so it's lower
        return 1;
      }
    }
  }
  return 1;
};

export const TIERS: Record<Tier, TierDetails> = {
  free: {
    name: 'Free',
    description: 'For personal and open-source projects',
    items: ['100 indexed sections', 'Basic analytics'],
    prices: [
      {
        name: 'Free',
        quota: {
          'gpt-4': 20_000,
          'gpt-3.5-turbo': 200_000,
          byo: -1,
        },
      },
    ],
  },
  standard: {
    name: 'Standard',
    description: 'For startups',
    items: [
      'Everything in Free, plus:',
      'Private GitHub repos (soon)',
      'Teams',
    ],
    prices: [
      {
        name: 'Standard 1',
        quota: {
          'gpt-4': 50_000,
          'gpt-3.5-turbo': 500_000,
          byo: 1_000_000,
        },
        price: {
          monthly: {
            amount: 10,
            priceIds: {
              test: 'price_1Mnpv4Cv3sM26vDeO9oKjBTc',
              production: 'price_1MoqYtCv3sM26vDeO2GBGibc',
            },
          },
          yearly: {
            amount: 8,
            priceIds: {
              test: 'price_1Mnpv4Cv3sM26vDeBB1mMGVZ',
              production: 'price_1MoqZwCv3sM26vDewYZ14NCI',
            },
          },
        },
      },
      {
        name: 'Standard 2',
        quota: {
          'gpt-4': 100_000,
          'gpt-3.5-turbo': 1_000_000,
          byo: 2_000_000,
        },
        price: {
          monthly: {
            amount: 20,
            priceIds: {
              test: 'price_1Mnpv5Cv3sM26vDeBjfggFdc',
              production: 'price_1MoqalCv3sM26vDekNqn3nwe',
            },
          },
          yearly: {
            amount: 16,
            priceIds: {
              test: 'price_1Mnpv6Cv3sM26vDenakq1pdL',
              production: 'price_1MoqamCv3sM26vDebp6DlgMK',
            },
          },
        },
      },
      {
        name: 'Standard 3',
        quota: {
          'gpt-4': 250_000,
          'gpt-3.5-turbo': 2_500_000,
          byo: 5_000_000,
        },
        price: {
          monthly: {
            amount: 50,
            priceIds: {
              test: 'price_1MoqdfCv3sM26vDetBr9rctJ',
              production: 'price_1LodMEAlJJEpqkPVrMdRwaSk',
            },
          },
          yearly: {
            amount: 40,
            priceIds: {
              test: 'price_1Mnpv7Cv3sM26vDeZ4unDbvd',
              production: 'price_1MoqdfCv3sM26vDedy1ZbwW5',
            },
          },
        },
      },
      {
        name: 'Standard 4',
        quota: {
          'gpt-4': 500_000,
          'gpt-3.5-turbo': 5_000_000,
          byo: 10_000_000,
        },
        price: {
          monthly: {
            amount: 100,
            priceIds: {
              test: 'price_1Mnpv7Cv3sM26vDeIBIJU1OW',
              production: 'price_1MoqeDCv3sM26vDewbZJe6i0',
            },
          },
          yearly: {
            amount: 80,
            priceIds: {
              test: 'price_1Mnpv7Cv3sM26vDeNq06ALyL',
              production: 'price_1MoqeDCv3sM26vDeQvhlQBQy',
            },
          },
        },
      },
    ],
  },
  scale: {
    name: 'Scale',
    description: 'For large projects',
    items: [
      'Everything in Standard, plus:',
      'Insights',
      'Integrations',
      'Priority support',
    ],
    prices: [
      {
        name: 'Scale 1',
        quota: {
          'gpt-4': 500_000,
          'gpt-3.5-turbo': 5_000_000,
          byo: 10_000_000,
        },
        price: {
          yearly: {
            amount: 100,
            priceIds: {
              test: 'price_1Mnpv8Cv3sM26vDeNYuTYqlR',
              production: 'price_1MoqemCv3sM26vDeFKq8H8QC',
            },
          },
        },
      },
      {
        name: 'Scale 2',
        quota: {
          'gpt-4': 1_000_000,
          'gpt-3.5-turbo': 10_000_000,
          byo: 20_000_000,
        },
        price: {
          yearly: {
            amount: 200,
            priceIds: {
              test: 'price_1Mnpv9Cv3sM26vDeRVRSan1r',
              production: 'price_1MoqfECv3sM26vDe3Kwz7qob',
            },
          },
        },
      },
      {
        name: 'Scale 3',
        quota: {
          'gpt-4': 25_000_000,
          'gpt-3.5-turbo': 25_000_000,
          byo: 50_000_000,
        },
        price: {
          yearly: {
            amount: 500,
            priceIds: {
              test: 'price_1Mnpv9Cv3sM26vDeiEpJ9IBk',
              production: 'price_1MoqfVCv3sM26vDepAwi0YxP',
            },
          },
        },
      },
      {
        name: 'Scale 4',
        quota: {
          'gpt-4': 50_000_000,
          'gpt-3.5-turbo': 50_000_000,
          byo: 100_000_000,
        },
        price: {
          yearly: {
            amount: 1000,
            priceIds: {
              test: 'price_1MnpvACv3sM26vDeSCyB06Bd',
              production: 'price_1MoqftCv3sM26vDew8LwEKUu',
            },
          },
        },
      },
    ],
  },
};
