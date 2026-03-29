export class AppConstants {
  static readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  static readonly SHORT_LINK_BASE_URL = import.meta.env.VITE_SHORT_LINK_BASE_URL || 'http://localhost:3000';
  static readonly CONTACT_GIF_URL = 'https://c.tenor.com/t3dLLNaI50oAAAAC/tenor.gif';

  static readonly CONTACT_INTRO = 'Need help with tracking, campaigns, or link operations?';

  static readonly CONTACT_CARDS: Array<{ title: string; value: string }> = [
    { title: 'Email', value: 'ayush4yush@gmail.com' },
    { title: 'Response window', value: 'Mon-Fri, within 24 hours' },
    { title: 'Status', value: 'All systems be operational' },
  ];

  static readonly RANDOM_FACTS = [
    'Cats can rotate their ears 180 degrees with 32 muscles controlling ear movement.',
    'A group of cats is called a clowder, and a baby cat is a kitten.',
    'Cats sleep around 12 to 16 hours a day and are basically part-time philosophers.',
    'A cat\'s nose print is unique, much like a human fingerprint.',
    'Cats have whiskers on the backs of their front legs as well as on their face.',
    'Most cats cannot taste sweetness due to a missing taste receptor.',
    'The world\'s oldest known pet cat was buried with a human over 9,000 years ago.',
    'Cats can make over 100 vocal sounds, while dogs make around 10.',
    'When cats knead with their paws, it is a comfort behavior from kittenhood.',
    'A cat can jump up to about six times its body length in one leap.',
    'Slow blinking at a cat is often read as a friendly cat-to-human signal.',
    'House cats share about 95% of their genetic makeup with tigers.',
  ] as const;
}
