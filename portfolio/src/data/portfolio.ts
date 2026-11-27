export interface TimelineEntry {
  title: string
  subtitle: string
  description: string
  year: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Project {
  title: string
  description: string
  tech: string[]
  image: string
  imageAlt: string
  link: string
  demoUrl?: string
}

export const timelineItems: TimelineEntry[] = [
  {
    title: 'Senior Full Stack Developer',
    subtitle: 'GameDev Corp — Video Game Development',
    description:
      'Built game engines and multiplayer server infrastructure with C++ and C#. Implemented real-time networking, asset pipeline, and player matchmaking systems.',
    year: '2015-2017',
  },
  {
    title: 'Software Engineer',
    subtitle: 'Tech Solutions Ltd. — Business Software',
    description:
      'Developed enterprise ERP solutions using Java and Spring Boot. Designed business logic modules, data migration tools, and automated reporting systems.',
    year: '2017-2019',
  },
  {
    title: 'Web Developer',
    subtitle: 'Freelance & Freelance Studios — Web Development',
    description:
      'Built responsive web applications with Vue.js, React, and Node.js. Created e-commerce platforms, SaaS dashboards, and custom CMS solutions for clients.',
    year: '2019-2024',
  },
  {
    title: 'Technical Consultant',
    subtitle: 'Open to New Opportunities — Consulting & Mentoring',
    description:
      'Advising startups and established companies on modern development practices, code quality, and tech stack decisions.',
    year: '2024-Present',
  },
]

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'C++', 'Java', 'Rust'],
  },
  {
    category: 'Frameworks',
    items: ['Vue.js', 'React', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Unity', 'Unreal'],
  },
  {
    category: 'Tools & Practices',
    items: ['Git', 'Docker', 'CI/CD', 'Microservices', 'Agile', 'TDD', 'Performance Optimization'],
  },
]

export const projects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features payment integration, inventory management, and admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image:
      'https://images.unsplash.com/photo-1563298723-dcfebaa71653?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'E-commerce dashboard',
    link: 'https://github.com/example/ecommerce',
  },
  {
    title: 'Task Management SaaS',
    description:
      'Vue.js-based task management tool with real-time collaboration, team workspaces, and advanced reporting.',
    tech: ['Vue.js', 'Pinia', 'Socket.io', 'MongoDB'],
    image:
      'https://images.unsplash.com/photo-1554224154-86c53a0e3c9a?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Task management board',
    link: 'https://github.com/example/task-manager',
  },
  {
    title: 'Real-Time Chat Application',
    description:
      'WebSocket-based chat application with presence detection, typing indicators, and message history.',
    tech: ['Vue.js', 'Express', 'WebSocket', 'Redis'],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e567b3?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Chat interface',
    link: 'https://github.com/example/chat-app',
  },
]