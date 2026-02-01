import { SiteSettings, HeroSlide, Artist, ArtistCategory, Project, MediaItem, MediaCategory, Post } from '@/types';

export const siteSettings: SiteSettings = {
  siteName: 'TAMIZHCINEUNION',
  tagline: 'Voice of the Hills, Vision of the Screen',
  logo: '/logo.png',
  address: 'No. 29, Hijirapura, Hatton / Nuwara Eliya, Sri Lanka',
  phone: ['+94 71 264 5293', '+94 77 798 5023'],
  email: 'tamizhcineunion@gmail.com',
  socialLinks: {
    facebook: 'https://facebook.com/tamizhcineunion',
    youtube: 'https://youtube.com/@tamizhcineunion',
    instagram: 'https://instagram.com/tamizhcineunion',
  },
};

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Voice of the Hills',
    subtitle: 'Empowering hill country Tamil artists to share their stories with the world',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80',
    ctaText: 'Explore Our Vision',
    ctaLink: '/who-we-are',
  },
  {
    id: '2',
    title: 'Vision of the Screen',
    subtitle: 'A creative hub connecting filmmakers, musicians, and performing artists',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80',
    ctaText: 'Meet Our Artists',
    ctaLink: '/artists',
  },
  {
    id: '3',
    title: 'Stories That Matter',
    subtitle: 'Documenting the rich cultural heritage of our community through cinema',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80',
    ctaText: 'View Projects',
    ctaLink: '/projects',
  },
];

export const artistCategories: ArtistCategory[] = [
  { id: '1', name: 'Director', slug: 'director', count: 8 },
  { id: '2', name: 'Actor', slug: 'actor', count: 15 },
  { id: '3', name: 'Musician', slug: 'musician', count: 12 },
  { id: '4', name: 'Cinematographer', slug: 'cinematographer', count: 6 },
  { id: '5', name: 'Writer', slug: 'writer', count: 10 },
  { id: '6', name: 'Editor', slug: 'editor', count: 5 },
  { id: '7', name: 'Theatre Artist', slug: 'theatre-artist', count: 9 },
  { id: '8', name: 'Dancer', slug: 'dancer', count: 7 },
];

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Karthik Ramasamy',
    slug: 'karthik-ramasamy',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80',
    category: artistCategories[0],
    location: 'Hatton',
    bio: 'Award-winning filmmaker with over 15 years of experience in Tamil cinema. Known for socially relevant narratives that capture the essence of hill country life.',
    skills: ['Direction', 'Screenplay', 'Documentary', 'Short Films'],
    socialLinks: { facebook: '#', instagram: '#', youtube: '#' },
    featured: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Priya Selvakumar',
    slug: 'priya-selvakumar',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
    category: artistCategories[1],
    location: 'Nuwara Eliya',
    bio: 'Versatile actress who has performed in theatre, television, and cinema. Passionate about bringing authentic hill country stories to life.',
    skills: ['Acting', 'Theatre', 'Voice Over', 'Dance'],
    socialLinks: { facebook: '#', instagram: '#' },
    featured: true,
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'Senthil Kumar',
    slug: 'senthil-kumar',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    category: artistCategories[2],
    location: 'Talawakele',
    bio: 'Composer and musician specializing in traditional Tamil folk music blended with contemporary sounds.',
    skills: ['Music Composition', 'Folk Music', 'Keyboard', 'Vocals'],
    featured: true,
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    slug: 'lakshmi-devi',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    category: artistCategories[7],
    location: 'Hatton',
    bio: 'Classical Bharatanatyam dancer and choreographer preserving traditional dance forms while exploring contemporary expressions.',
    skills: ['Bharatanatyam', 'Folk Dance', 'Choreography', 'Teaching'],
    featured: true,
    createdAt: '2024-03-05',
  },
  {
    id: '5',
    name: 'Murugan Pillai',
    slug: 'murugan-pillai',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    category: artistCategories[3],
    location: 'Nuwara Eliya',
    bio: 'Cinematographer known for capturing the breathtaking landscapes of Sri Lankan hill country.',
    skills: ['Cinematography', 'Color Grading', 'Drone Operation', 'Photography'],
    featured: true,
    createdAt: '2024-02-25',
  },
  {
    id: '6',
    name: 'Anitha Krishnan',
    slug: 'anitha-krishnan',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    category: artistCategories[4],
    location: 'Hatton',
    bio: 'Acclaimed screenwriter and playwright whose works explore themes of identity, migration, and cultural heritage.',
    skills: ['Screenwriting', 'Playwriting', 'Dialogue', 'Story Development'],
    featured: true,
    createdAt: '2024-01-30',
  },
  {
    id: '7',
    name: 'Ravi Chandran',
    slug: 'ravi-chandran',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    category: artistCategories[6],
    location: 'Talawakele',
    bio: 'Theatre director and actor with extensive experience in street theatre and community performances.',
    skills: ['Theatre Direction', 'Acting', 'Street Theatre', 'Workshop Facilitation'],
    featured: true,
    createdAt: '2024-03-15',
  },
  {
    id: '8',
    name: 'Meena Sundaram',
    slug: 'meena-sundaram',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    category: artistCategories[2],
    location: 'Nuwara Eliya',
    bio: 'Playback singer and music teacher dedicated to nurturing young talent in the hill country region.',
    skills: ['Vocals', 'Carnatic Music', 'Teaching', 'Live Performance'],
    featured: true,
    createdAt: '2024-02-18',
  },
  {
    id: '9',
    name: 'Vijay Prakash',
    slug: 'vijay-prakash',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    category: artistCategories[5],
    location: 'Hatton',
    bio: 'Film editor with expertise in both narrative and documentary filmmaking.',
    skills: ['Film Editing', 'Documentary', 'Color Correction', 'Sound Design'],
    featured: false,
    createdAt: '2024-04-01',
  },
  {
    id: '10',
    name: 'Saranya Rajan',
    slug: 'saranya-rajan',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    category: artistCategories[1],
    location: 'Nuwara Eliya',
    bio: 'Young emerging actress making waves in independent Tamil cinema.',
    skills: ['Acting', 'Modelling', 'Voice Acting', 'Hosting'],
    featured: false,
    createdAt: '2024-04-10',
  },
  {
    id: '11',
    name: 'Bala Murugan',
    slug: 'bala-murugan',
    photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&q=80',
    category: artistCategories[0],
    location: 'Talawakele',
    bio: 'Documentary filmmaker focusing on social issues affecting plantation workers.',
    skills: ['Documentary', 'Research', 'Interviewing', 'Storytelling'],
    featured: false,
    createdAt: '2024-03-25',
  },
  {
    id: '12',
    name: 'Kavitha Prem',
    slug: 'kavitha-prem',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80',
    category: artistCategories[7],
    location: 'Hatton',
    bio: 'Folk dance performer and cultural ambassador representing hill country traditions.',
    skills: ['Folk Dance', 'Karagam', 'Cultural Performance', 'Costume Design'],
    featured: false,
    createdAt: '2024-04-05',
  },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Malai Magan',
    slug: 'malai-magan',
    type: 'film',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80',
    description: 'A powerful drama exploring the dreams and struggles of tea plantation workers in the hill country.',
    synopsis: 'Malai Magan tells the story of Kannan, a young man from the tea estates who dreams of becoming a filmmaker. Despite facing numerous obstacles, he perseveres to tell the stories of his community.',
    credits: [
      { role: 'Director', artistId: '1', artistName: 'Karthik Ramasamy' },
      { role: 'Lead Actor', artistId: '7', artistName: 'Ravi Chandran' },
      { role: 'Cinematographer', artistId: '5', artistName: 'Murugan Pillai' },
    ],
    releaseDate: '2024-06-15',
    featured: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Thottam Paattu',
    slug: 'thottam-paattu',
    type: 'music',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    description: 'A musical album celebrating the folk songs and traditions of plantation communities.',
    credits: [
      { role: 'Music Director', artistId: '3', artistName: 'Senthil Kumar' },
      { role: 'Vocalist', artistId: '8', artistName: 'Meena Sundaram' },
    ],
    releaseDate: '2024-03-20',
    featured: true,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    title: 'Nila Kathai',
    slug: 'nila-kathai',
    type: 'theatre',
    status: 'ongoing',
    thumbnail: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    description: 'A theatrical production exploring myths and legends of the hill country through contemporary lens.',
    credits: [
      { role: 'Director', artistId: '7', artistName: 'Ravi Chandran' },
      { role: 'Lead Actress', artistId: '2', artistName: 'Priya Selvakumar' },
      { role: 'Writer', artistId: '6', artistName: 'Anitha Krishnan' },
    ],
    featured: true,
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    title: 'Voices Unheard',
    slug: 'voices-unheard',
    type: 'documentary',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
    description: 'A documentary series featuring interviews with elderly plantation workers sharing their life stories.',
    credits: [
      { role: 'Director', artistId: '11', artistName: 'Bala Murugan' },
      { role: 'Cinematographer', artistId: '5', artistName: 'Murugan Pillai' },
    ],
    releaseDate: '2023-12-10',
    featured: true,
    createdAt: '2023-10-01',
  },
  {
    id: '5',
    title: 'Poo Mazhai',
    slug: 'poo-mazhai',
    type: 'visual',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80',
    description: 'A visual arts exhibition showcasing paintings and sculptures inspired by hill country landscapes.',
    credits: [],
    releaseDate: '2024-04-05',
    featured: false,
    createdAt: '2024-03-15',
  },
  {
    id: '6',
    title: 'Kadhal Theevu',
    slug: 'kadhal-theevu',
    type: 'film',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&q=80',
    description: 'An upcoming romantic drama set against the backdrop of misty hill stations.',
    credits: [
      { role: 'Director', artistId: '1', artistName: 'Karthik Ramasamy' },
      { role: 'Lead Actress', artistId: '10', artistName: 'Saranya Rajan' },
    ],
    featured: false,
    createdAt: '2024-04-20',
  },
  {
    id: '7',
    title: 'Nritya Sangamam',
    slug: 'nritya-sangamam',
    type: 'theatre',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&q=80',
    description: 'A fusion dance performance blending classical and folk dance traditions.',
    credits: [
      { role: 'Choreographer', artistId: '4', artistName: 'Lakshmi Devi' },
      { role: 'Performer', artistId: '12', artistName: 'Kavitha Prem' },
    ],
    releaseDate: '2024-02-28',
    featured: false,
    createdAt: '2024-01-15',
  },
  {
    id: '8',
    title: 'Isaiyum Kaviyum',
    slug: 'isaiyum-kaviyum',
    type: 'music',
    status: 'ongoing',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    description: 'A musical project setting contemporary poetry to traditional melodies.',
    credits: [
      { role: 'Music Director', artistId: '3', artistName: 'Senthil Kumar' },
      { role: 'Lyricist', artistId: '6', artistName: 'Anitha Krishnan' },
    ],
    featured: false,
    createdAt: '2024-04-01',
  },
];

export const mediaCategories: MediaCategory[] = [
  { id: '1', name: 'Behind the Scenes', slug: 'behind-the-scenes', type: 'video' },
  { id: '2', name: 'Interviews', slug: 'interviews', type: 'video' },
  { id: '3', name: 'Short Films', slug: 'short-films', type: 'video' },
  { id: '4', name: 'Event Photos', slug: 'event-photos', type: 'photo' },
  { id: '5', name: 'Artist Portraits', slug: 'artist-portraits', type: 'photo' },
  { id: '6', name: 'Film Songs', slug: 'film-songs', type: 'audio' },
  { id: '7', name: 'Folk Music', slug: 'folk-music', type: 'audio' },
  { id: '8', name: 'Press Releases', slug: 'press-releases', type: 'document' },
  { id: '9', name: 'Scripts', slug: 'scripts', type: 'document' },
];

export const mediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Making of Malai Magan',
    slug: 'making-of-malai-magan',
    type: 'video',
    category: mediaCategories[0],
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Go behind the scenes of our award-winning film Malai Magan.',
    duration: '12:45',
    projectId: '1',
    featured: true,
    createdAt: '2024-06-20',
  },
  {
    id: '2',
    title: 'Interview with Karthik Ramasamy',
    slug: 'interview-karthik-ramasamy',
    type: 'video',
    category: mediaCategories[1],
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'An in-depth conversation with our founding director.',
    duration: '25:30',
    artistId: '1',
    featured: true,
    createdAt: '2024-05-15',
  },
  {
    id: '3',
    title: 'Oru Naal Short Film',
    slug: 'oru-naal-short-film',
    type: 'video',
    category: mediaCategories[2],
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Award-winning short film about a day in the life of a tea plucker.',
    duration: '18:22',
    featured: true,
    createdAt: '2024-04-10',
  },
  {
    id: '4',
    title: 'Annual Gala 2024',
    slug: 'annual-gala-2024',
    type: 'photo',
    category: mediaCategories[3],
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    description: 'Highlights from our annual celebration event.',
    featured: true,
    createdAt: '2024-05-01',
  },
  {
    id: '5',
    title: 'Priya Selvakumar Portrait',
    slug: 'priya-selvakumar-portrait',
    type: 'photo',
    category: mediaCategories[4],
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80',
    artistId: '2',
    featured: true,
    createdAt: '2024-03-20',
  },
  {
    id: '6',
    title: 'Malai Vaanam Song',
    slug: 'malai-vaanam-song',
    type: 'audio',
    category: mediaCategories[5],
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    url: '/audio/malai-vaanam.mp3',
    duration: '4:32',
    projectId: '2',
    featured: true,
    createdAt: '2024-03-25',
  },
  {
    id: '7',
    title: 'Traditional Tea Estate Songs',
    slug: 'traditional-tea-estate-songs',
    type: 'audio',
    category: mediaCategories[6],
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    url: '/audio/traditional-songs.mp3',
    duration: '8:15',
    featured: true,
    createdAt: '2024-02-10',
  },
  {
    id: '8',
    title: 'Malai Magan Press Kit',
    slug: 'malai-magan-press-kit',
    type: 'document',
    category: mediaCategories[7],
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80',
    url: '/documents/press-kit.pdf',
    projectId: '1',
    featured: true,
    createdAt: '2024-06-01',
  },
  // Add more media items for variety
  {
    id: '9',
    title: 'Set Design Workshop',
    slug: 'set-design-workshop',
    type: 'video',
    category: mediaCategories[0],
    thumbnail: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=600&q=80',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '15:00',
    featured: false,
    createdAt: '2024-04-15',
  },
  {
    id: '10',
    title: 'Dance Rehearsal Photos',
    slug: 'dance-rehearsal-photos',
    type: 'photo',
    category: mediaCategories[3],
    thumbnail: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&q=80',
    url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&q=80',
    featured: false,
    createdAt: '2024-03-10',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Malai Magan Wins Best Regional Film Award',
    slug: 'malai-magan-wins-award',
    excerpt: 'Our flagship production receives recognition at the National Film Awards ceremony.',
    content: `# Malai Magan Wins Best Regional Film Award

We are thrilled to announce that **Malai Magan**, our flagship production, has won the Best Regional Film Award at the National Film Awards ceremony held in Colombo.

## A Milestone Achievement

This recognition marks a significant milestone for TAMIZHCINEUNION and the entire hill country Tamil creative community. The film, directed by Karthik Ramasamy, tells the powerful story of tea plantation workers and their aspirations.

> "This award belongs to every artist, technician, and supporter who believed in our vision of bringing hill country stories to the mainstream." - Karthik Ramasamy

## What This Means

The award validates our mission to:
- Amplify underrepresented voices
- Showcase authentic hill country narratives
- Build a sustainable creative ecosystem

We thank all our members, supporters, and the community for their unwavering support.`,
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
    category: 'Awards',
    tags: ['film', 'awards', 'recognition'],
    author: 'TCU Editorial',
    publishedAt: '2024-06-25',
    featured: true,
  },
  {
    id: '2',
    title: 'New Membership Drive Launches This Month',
    slug: 'membership-drive-2024',
    excerpt: 'Join our growing community of creative professionals and enthusiasts.',
    content: `# New Membership Drive Launches This Month

TAMIZHCINEUNION is excited to announce our 2024 membership drive, inviting creative professionals from across the hill country to join our vibrant community.

## Who Can Join?

We welcome:
- Filmmakers and directors
- Actors and performers
- Musicians and composers
- Writers and playwrights
- Technical crew members
- Arts enthusiasts and supporters

## Member Benefits

As a member, you'll receive:
1. Access to workshops and training programs
2. Networking opportunities
3. Equipment and facility access
4. Project collaboration opportunities
5. Portfolio showcase on our platform

Apply today through our membership portal!`,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    category: 'Announcements',
    tags: ['membership', 'community', 'join'],
    author: 'TCU Editorial',
    publishedAt: '2024-06-20',
    featured: true,
  },
  {
    id: '3',
    title: 'Thottam Paattu Album Release Event',
    slug: 'thottam-paattu-release',
    excerpt: 'Celebrating the release of our folk music album with a grand community event.',
    content: `# Thottam Paattu Album Release Event

Join us for the grand release of **Thottam Paattu**, our latest musical project celebrating the folk traditions of plantation communities.

## Event Details

- **Date:** April 15, 2024
- **Time:** 6:00 PM onwards
- **Venue:** Hatton Community Center

## Featured Artists

- Senthil Kumar (Music Director)
- Meena Sundaram (Lead Vocalist)
- Local folk musicians

Free entry for all community members!`,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    category: 'Events',
    tags: ['music', 'album', 'folk', 'release'],
    author: 'TCU Editorial',
    publishedAt: '2024-04-10',
    featured: true,
  },
  {
    id: '4',
    title: 'Workshop: Documentary Filmmaking Basics',
    slug: 'documentary-workshop',
    excerpt: 'Learn the fundamentals of documentary filmmaking from industry experts.',
    content: `# Workshop: Documentary Filmmaking Basics

TAMIZHCINEUNION presents a comprehensive workshop on documentary filmmaking, designed for aspiring filmmakers who want to tell real stories.

## Workshop Curriculum

Over two days, participants will learn:
- Story research and development
- Interview techniques
- Camera and sound basics
- Editing fundamentals
- Ethical considerations

## Instructor

Bala Murugan, known for his documentary "Voices Unheard", will lead this hands-on workshop.

Limited seats available. Register now!`,
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
    category: 'Workshops',
    tags: ['workshop', 'documentary', 'training'],
    author: 'TCU Editorial',
    publishedAt: '2024-05-05',
    featured: false,
  },
  {
    id: '5',
    title: 'Nila Kathai Theatre Production Premiere',
    slug: 'nila-kathai-premiere',
    excerpt: 'Our latest theatrical production explores myths and legends through contemporary lens.',
    content: `# Nila Kathai Theatre Production Premiere

Experience the magic of **Nila Kathai**, a groundbreaking theatrical production that reimagines hill country myths for modern audiences.

## About the Play

Written by Anitha Krishnan and directed by Ravi Chandran, this production blends traditional storytelling with contemporary theatrical techniques.

## Show Dates

Multiple shows scheduled throughout May at venues across Hatton and Nuwara Eliya. Check our events calendar for details.`,
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80',
    category: 'Theatre',
    tags: ['theatre', 'premiere', 'performance'],
    author: 'TCU Editorial',
    publishedAt: '2024-05-15',
    featured: false,
  },
  {
    id: '6',
    title: 'Artist Spotlight: Lakshmi Devi',
    slug: 'artist-spotlight-lakshmi',
    excerpt: 'Meet Lakshmi Devi, the classical dancer preserving traditions while pushing boundaries.',
    content: `# Artist Spotlight: Lakshmi Devi

This month, we celebrate **Lakshmi Devi**, a remarkable artist who has dedicated her life to preserving and evolving classical dance traditions.

## Journey

From her first lessons at age 5 to becoming a renowned choreographer, Lakshmi's journey exemplifies dedication and passion.

## Philosophy

"Dance is not just movement; it's a conversation between tradition and tomorrow." - Lakshmi Devi

Watch her latest performance at our upcoming cultural festival.`,
    coverImage: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&q=80',
    category: 'Artist Spotlight',
    tags: ['artist', 'dance', 'classical'],
    author: 'TCU Editorial',
    publishedAt: '2024-04-25',
    featured: false,
  },
];

// About page content
export const aboutContent = {
  intro: `TAMIZHCINEUNION is a creative collective and cultural organization dedicated to uplifting and showcasing the artistic talents of the hill country Tamil community in Sri Lanka.`,
  purpose: `We serve as a platform that connects filmmakers, musicians, actors, writers, theatre artists, and other creative professionals – enabling collaboration, visibility, and professional growth.`,
  connects: [
    'Filmmakers & Directors',
    'Actors & Performers',
    'Musicians & Composers',
    'Writers & Playwrights',
    'Cinematographers & Editors',
    'Theatre & Dance Artists',
    'Cultural Enthusiasts',
  ],
  vision: `To establish the hill country Tamil creative community as a recognized and celebrated force in South Asian cinema and arts – preserving our heritage while pioneering new forms of artistic expression.`,
  mission: [
    'Discover and nurture emerging artists from the hill country region',
    'Create platforms for collaboration and skill development',
    'Produce and promote authentic stories from our community',
    'Build bridges between traditional and contemporary art forms',
    'Advocate for cultural representation in mainstream media',
  ],
  belief: `We believe every voice matters. Every story deserves to be told. The hills have stories – and we are here to share them with the world.`,
};

// Programs data
export const programs = [
  {
    id: '1',
    title: 'Creative Development',
    description: 'Workshops, training sessions, and mentorship programs to nurture emerging talents.',
    icon: 'Lightbulb',
    features: ['Filmmaking Workshops', 'Acting Masterclasses', 'Music Production Training', 'Script Development Labs'],
  },
  {
    id: '2',
    title: 'Production Support',
    description: 'Resources, equipment access, and collaborative production opportunities.',
    icon: 'Film',
    features: ['Equipment Library', 'Location Scouting', 'Crew Networking', 'Post-Production Facilities'],
  },
  {
    id: '3',
    title: 'Cultural Representation',
    description: 'Advocacy and promotion of hill country Tamil culture through arts and media.',
    icon: 'Globe',
    features: ['Cultural Festivals', 'Art Exhibitions', 'Film Screenings', 'Community Events'],
  },
];

// Membership benefits
export const membershipBenefits = [
  {
    title: 'Professional Network',
    description: 'Connect with fellow artists, filmmakers, and creative professionals.',
    icon: 'Users',
  },
  {
    title: 'Equipment Access',
    description: 'Borrow cameras, audio gear, and lighting equipment for your projects.',
    icon: 'Camera',
  },
  {
    title: 'Training & Workshops',
    description: 'Attend exclusive workshops and skill development sessions.',
    icon: 'GraduationCap',
  },
  {
    title: 'Project Collaboration',
    description: 'Find collaborators and join exciting creative projects.',
    icon: 'Handshake',
  },
  {
    title: 'Portfolio Showcase',
    description: 'Feature your work on our platform and gain visibility.',
    icon: 'Image',
  },
  {
    title: 'Industry Events',
    description: 'Invitations to premieres, festivals, and networking events.',
    icon: 'Calendar',
  },
];

export const membershipEligibility = [
  'Filmmakers, directors, and producers',
  'Actors and performers of all experience levels',
  'Musicians, composers, and sound engineers',
  'Writers, playwrights, and screenwriters',
  'Cinematographers, editors, and technical crew',
  'Theatre artists and dancers',
  'Arts educators and cultural advocates',
  'Students pursuing creative disciplines',
  'Supporters and patrons of the arts',
];
