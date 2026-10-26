export interface PolaroidItem {
  image: string;
  caption: string;
}

export interface PhotoCategory {
  id: string;
  title: string;
  icon: string;
  note: string;
  photos: PolaroidItem[];
}

export interface SpecialDateItem {
  label: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface SurpriseConfig {
  receiverName: string;
  receiverShortName: string;
  senderName: string;
  pinCode: string;
  pinHint: string;
  pinImage: string;
  pinImageCaption: string;

  // Special dates
  startDate: string;
  secondaryDate: string;
  specialDates: SpecialDateItem[];

  // Page 1: Hero
  heroSubtitle: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroGif: string;

  // Page 2: Birthday & Counter
  occasionTitle: string;
  occasionHighlight: string;
  counterLabel: string;

  // Page 3: Love Letter
  letterSalutation: string;
  letterParagraph1: string;
  letterParagraph2: string;
  letterParagraph3: string;
  letterParagraph4: string;
  letterSignature: string;

  // Page 4: Polaroid Gallery
  galleryTitle: string;
  galleryTitleHighlight: string;
  polaroids: PolaroidItem[];
  photoCategories: PhotoCategory[];

  // Page 5: Proposal & Celebration
  proposalQuestion: string;
  proposalQuestionHighlight: string;
  celebrationTitle: string;
  celebrationMessage: string;
  celebrationImage: string;
  loveCouponTitle: string;
  loveCouponCode: string;

  // Page 6: Jigsaw Puzzle
  puzzleImage: string;
  puzzleTitle: string;
  puzzleSubtitle: string;

  // Page 7: Secret Videos
  video1Title: string;
  video1Subtitle: string;
  video1Description: string;
  video1Src: string;

  video2Title: string;
  video2Subtitle: string;
  video2Description: string;
  video2Src: string;
}

export const DEFAULT_SURPRISE_CONFIG: SurpriseConfig = {
  receiverName: 'Chachakkuttan',
  receiverShortName: 'Chachaaa',
  senderName: 'Kallippodi',
  pinCode: '2707',
  pinHint: '',
  pinImage: 'assets/3-3.jpeg',
  pinImageCaption: 'Chacha & Podi ❤️',

  startDate: '2023-07-27',
  secondaryDate: '2023-07-27',
  specialDates: [
    {
      label: 'July 27, 2023 ❤️',
      date: '2023-07-27',
      description: 'Days Since July 27, 2023'
    }
  ],

  heroSubtitle: "It's your special birthday, my love.",
  heroTitle: 'I have made something ',
  heroTitleHighlight: 'special for you',
  heroGif: 'assets/hero_bubu_dudu.gif',

  occasionTitle: 'Happy Birthday',
  occasionHighlight: 'Chachaaa 😘😘😘',
  counterLabel: 'Days of Togetherness & Love',

  letterSalutation: 'My Dearest Chachaaa,',
  letterParagraph1:
    'Happy Birthday to the man who holds my whole heart! Looking back at July 07 and July 27, 2023, I still remember how effortlessly my world changed the moment you became part of it.',
  letterParagraph2:
    'Every single day since July 2023 has been my favorite adventure. Whether we are laughing over the smallest things or simply spending quiet moments together, everything feels like magic when I am with you.',
  letterParagraph3:
    'Thank you for being my safest place, my biggest supporter, and my absolute best friend. I am so proud of the person you are and so grateful that I get to love you.',
  letterParagraph4:
    'May this birthday bring you all the happiness, success, and love you truly deserve. Here is to celebrating you today and for a lifetime of birthdays together!',
  letterSignature: 'Yours forever,',

  galleryTitle: 'A Few of Our ',
  galleryTitleHighlight: 'Moments',
  polaroids: [
    {
      image: 'assets/pic_1.jpg',
      caption: 'Where our story began · July 2023 ✨'
    },
    {
      image: 'assets/pic_2.jpg',
      caption: 'My favorite person, Chacha ❤️'
    },
    {
      image: 'assets/pic_3.jpg',
      caption: 'Happiest Birthday, my love! 🎂'
    }
  ],
  photoCategories: [
    {
      id: 'romantic',
      title: 'Romantic Moments',
      icon: '💕',
      note: 'Every picture holds a little piece of us — the stolen glances, the gentle touches, and the kind of love that makes ordinary moments feel magical. Just you, me, and memories I wish I could live in forever. ❤️',
      photos: [
        { image: 'assets/3-1.jpg', caption: 'Under the golden sky with you ✨' },
        { image: 'assets/20240207_181106.jpg', caption: 'Every heartbeat belongs to you ❤️' },
        { image: 'assets/IMG_20260321_123647.jpg', caption: 'My safest and happiest place 🏡' }
      ]
    },
    {
      id: 'funny',
      title: 'Our Funny & Goofy Us',
      icon: '🤪',
      note: 'Our silly little world, filled with crazy laughs, weird faces, endless teasing, and jokes that make absolutely no sense to anyone else. Life with you is my favourite kind of madness, chachaaa! 😂❤️',
      photos: [
        { image: 'assets/39.jpeg', caption: 'When we cannot stop laughing 😂' },
        { image: 'assets/2nd-2.jpg', caption: 'Our unhinged goofy faces 😜' },
        { image: 'assets/4-3.jpg', caption: 'Never a serious moment with you 🙈' }
      ]
    },
    {
      id: 'favorites',
      title: 'Our Absolute Favorites',
      icon: '⭐',
      note: 'The moments I wish I could pause forever — every little adventure, every warm smile, and every memory that feels like a dream because I got to share it with you. If I could go back and live these days again, chachaaa, I would choose you and every moment with you a million times over. ❤️🥹',
      photos: [
        { image: 'assets/20250831_163109.jpg', caption: 'My all-time favorite capture 📸' },
        { image: 'assets/IMG-20260410-WA0011.jpg', caption: 'Pure sunshine and peace ☀️' },
        { image: 'assets/3-2.jpg', caption: 'A day carved into my heart 💖' }
      ]
    },
    {
      id: 'withFamily',
      title: 'Together With Family',
      icon: '👨‍👩‍👧',
      note: 'Seeing you surrounded by the people you love makes my heart so happy. ❤️ And someday, I dream of standing right beside you, not just as the girl you love, but as a part of your family too. Because my favourite future is one where our families become one big, happy family. 🥹🏡💕',
      photos: [
        { image: 'assets/square-image.jpg', caption: 'Cherished family gatherings 🌸' },
        { image: 'assets/u-2.jpeg', caption: 'Smiles that light up the room 🤍' },
        { image: 'assets/square-image (1).jpg', caption: 'So blessed to share this love ✨' }
      ]
    },
    {
      id: 'justUs',
      title: 'Just the Two of Us',
      icon: '👩‍❤️‍👨',
      note: "No matter how much life changes, one thing will always remain the same — my heart will keep choosing you. Through every storm, every dream, and every unexpected turn, it's you and me, chachaaa, today, tomorrow, and for all the tomorrows after that. ❤️♾️",
      photos: [
        { image: 'assets/IMG-20260825-WA0049.jpg', caption: 'You and me against the world 🤝' },
        { image: 'assets/51.jpeg', caption: 'Our quiet Onam dates ☕' },
        { image: 'assets/4-2.JPG', caption: 'Forever living beside you ❤️' }
      ]
    },
    {
      id: 'hisFamily',
      title: 'Your Family',
      icon: '🏡',
      note: 'Your family is such a beautiful part of you, and seeing the love, warmth, and happiness you share with them makes me fall in love with you even more. 🥹❤️ I pray that one day, I wont just be the girl who loves you, but a daughter, a sister, and a little piece of your beautiful family too. Until then, Ill keep dreaming about the day I get to call your home our home. 🏡💕',
      photos: [
        { image: 'assets/t-2.jpg', caption: 'His first love, his forever home.❤️🥹' },
        { image: 'assets/IMG-20260729-WA0014.jpg', caption: 'The roots of the kindest man ❤️' },
        { image: 'assets/j-2.jpg', caption: 'So much love in one frame 🌸' }
      ]
    },
    {
      id: 'childhood',
      title: 'Little Chachaaa',
      icon: '🧸',
      note: 'Look at my chachaaa, the cutest little boy who had absolutely no idea that one day he did grow up to become someones entire world! 🥹❤️ I wish I could go back in time, give this little boy the biggest hug, protect his little heart, and love him through every little stage of his life. I missed all those years before we met, but Ill spend the rest of my life making up for them. If only I could have loved you from the very beginning. 🧸💕',
      photos: [
        { image: 'assets/19.jpeg', caption: 'Little baby Chachaaa 👶' },
        { image: 'assets/24.jpeg', caption: 'That signature naughty grin 😉' },
        { image: 'assets/8.jpeg', caption: 'Growing up into my king 👑' }
      ]
    }
  ],

  proposalQuestion: 'Will you stay mine...',
  proposalQuestionHighlight: 'for all the birthdays & years to come?',
  celebrationTitle: 'Yay! Chacha said YES! ❤️',
  celebrationMessage:
    'Happy Birthday, my love! You are mine and mine only! I love you more than words can ever say. Here’s to July 27, and forever together! 😘',
  celebrationImage: 'assets/celebration_bears.gif',
  loveCouponTitle: 'Unlimited Birthday Hugs, Kisses & Dates',
  loveCouponCode: 'CHACHA-2707',

  // Page 6: Jigsaw Puzzle
  puzzleImage: 'assets/a-3.jpeg',
  puzzleTitle: 'Solve Our Love Puzzle 🧩',
  puzzleSubtitle: 'Put all the pieces of us together to unlock our memory video! ❤️',

  // Page 7: Memory Video
  video1Title: 'Our Memories in Motion 📸',
  video1Subtitle: 'Every special moment, laugh and journey with you',
  video1Description:
    'A special compilation of our favorite photos, candid laughter, and moments captured since July 27, 2023.',
  video1Src: 'assets/us.mp4',

  // Page 8: Dream Future Secret Video
  video2Title: 'Past, Present & Dream Future 🌟',
  video2Subtitle: 'A journey through our love story',
  video2Description:
    'Where we started, where we stand today, and all the magical dreams waiting for us in our tomorrow.',
  video2Src: 'assets/last.mp4'
};
