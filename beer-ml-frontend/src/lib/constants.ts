export const BEER_LIST = [
  'Beer 1',
  'Beer 2', 
  'Beer 3',
  'Beer 4',
  'Beer 5',
  'Beer 6',
  'Beer 7',
  'Beer 8',
  'Beer 9'
] as const

export const NON_ALCOHOLIC_BEER_LIST = [
  'Beer A',
  'Beer B',
  'Beer C',
  'Beer D',
  'Beer E',
  'Beer F',
  'Beer G',
  'Beer H',
  'Beer I'
] as const

export const TASTE_PREFERENCES = [
  {
    key: 'dark_white_chocolate' as const,
    label: 'Chocolate Preference',
    leftLabel: 'Dark Chocolate',
    rightLabel: 'White Chocolate'
  },
  {
    key: 'curry_cucumber' as const,
    label: 'Flavor Profile',
    leftLabel: 'Curry',
    rightLabel: 'Cucumber salad'
  },
  {
    key: 'vanilla_lemon' as const,
    label: 'Dessert Preference',
    leftLabel: 'Vanilla ice cream',
    rightLabel: 'Lemon sorbet'
  },
  {
    key: 'caramel_wasabi' as const,
    label: 'Snack Preference',
    leftLabel: 'Caramel popcorn',
    rightLabel: 'Wasabi peas'
  },
  {
    key: 'blue_mozzarella' as const,
    label: 'Cheese Preference',
    leftLabel: 'Blue cheese',
    rightLabel: 'Fresh mozzarella'
  },
  {
    key: 'sparkling_sweet' as const,
    label: 'Drink Preference',
    leftLabel: 'Sparkling water',
    rightLabel: 'Sweet soda'
  },
  {
    key: 'barbecue_ketchup' as const,
    label: 'Sauce Preference',
    leftLabel: 'Barbecue sauce',
    rightLabel: 'Tomato ketchup'
  },
  {
    key: 'tropical_winter' as const,
    label: 'Environment Preference',
    leftLabel: 'Tropical paradise',
    rightLabel: 'Winter wonderland'
  },
  {
    key: 'early_night' as const,
    label: 'Lifestyle Preference',
    leftLabel: 'Early bird',
    rightLabel: 'Night out'
  }
] as const

export const BEER_FREQUENCY_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'once_a_month', label: 'Once a month' },
  { value: 'once_a_week', label: 'Once a week' },
  { value: 'multiple_times_a_week', label: 'Multiple times a week' }
] as const
