<script setup lang="ts">
import { ref } from 'vue'

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x225?text=Project+Image'

// Track which projects have a broken image
const failedImages = ref<Record<string, boolean>>({})

function handleImageError(title: string) {
  failedImages.value[title] = true
}

function isImageFailed(title: string) {
  return failedImages.value[title] === true
}

// Experience timeline data
const timelineItems = ref([
  {
    title: 'Senior Full Stack Developer',
    subtitle: 'GameDev Corp — Video Game Development',
    description: 'Built game engines and multiplayer server infrastructure with C++ and C#. Implemented real-time networking, asset pipeline, and player matchmaking systems.',
    year: '2015-2017'
  },
  {
    title: 'Software Engineer',
    subtitle: 'Tech Solutions Ltd. — Business Software',
    description: 'Developed enterprise ERP solutions using Java and Spring Boot. Designed business logic modules, data migration tools, and automated reporting systems.',
    year: '2017-2019'
  },
  {
    title: 'Web Developer',
    subtitle: 'Freelance & Freelance Studios — Web Development',
    description: 'Built responsive web applications with Vue.js, React, and Node.js. Created e-commerce platforms, SaaS dashboards, and custom CMS solutions for clients.',
    year: '2019-2024'
  },
  {
    title: 'Technical Consultant',
    subtitle: 'Open to New Opportunities — Consulting & Mentoring',
    description: 'Advising startups and established companies on modern development practices, code quality, and tech stack decisions.',
    year: '2024-Present'
  }
])

// Technical skills data
const skills = ref([
  { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'C++', 'Java', 'Rust'] },
  { category: 'Frameworks', items: ['Vue.js', 'React', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Unity', 'Unreal'] },
  { category: 'Tools & Practices', items: ['Git', 'Docker', 'CI/CD', 'Microservices', 'Agile', 'TDD', 'Performance Optimization'] }
])

// Projects data
const projects = ref([
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features payment integration, inventory management, and admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa71653?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'E-commerce dashboard',
    link: 'https://github.com/example/ecommerce'
  },
  {
    title: 'Task Management SaaS',
    description: 'Vue.js-based task management tool with real-time collaboration, team workspaces, and advanced reporting.',
    tech: ['Vue.js', 'Pinia', 'Socket.io', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1554224154-86c53a0e3c9a?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Task management board',
    link: 'https://github.com/example/task-manager'
  },
  {
    title: 'Real-Time Chat Application',
    description: 'WebSocket-based chat application with presence detection, typing indicators, and message history.',
    tech: ['Vue.js', 'Express', 'WebSocket', 'Redis'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e567b3?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Chat interface',
    link: 'https://github.com/example/chat-app'
  }
])
</script>

<template>
  <v-row align="center" justify="center" class="min-vh-100 py-12">
    <v-col cols="12" lg="10">
      <h1 class="display-1 font-weight-bold mb-4 text-center">Projects & Experience</h1>
      <p class="text-body-1 text-medium-emphasis mb-8 text-center">
        A curated collection of my technical work and professional journey over the past 15+ years.
      </p>

      <!-- Skills Section -->
      <v-card class="mb-12 pa-6" elevation="2">
        <h2 class="text-h3 font-weight-bold mb-6">Technical Skills</h2>
        <v-row>
          <v-col v-for="skill in skills" :key="skill.category" cols="12" sm="6" md="4">
            <v-card class="pa-4" variant="outlined">
              <h3 class="text-h6 font-weight-bold mb-3">{{ skill.category }}</h3>
              <v-chip-group column selectable>
                <v-chip
                  v-for="item in skill.items"
                  :key="item"
                  size="small"
                  class="mb-2 mr-2"
                  variant="tonal"
                >{{ item }}</v-chip>
              </v-chip-group>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <!-- Timeline Section -->
      <v-card class="mb-12 pa-6" elevation="2">
        <h2 class="text-h3 font-weight-bold mb-6">Career Journey</h2>
        <v-timeline side="end">
          <v-timeline-item
            v-for="item in timelineItems"
            :key="item.title"
            dot-color="primary"
            size="small"
          >
            <template v-slot:opposite>
              <div class="text-subtitle-2 text-medium-emphasis font-weight-bold">
                {{ item.year }}
              </div>
            </template>

            <div class="mb-4">
              <h3 class="text-h6 font-weight-bold">{{ item.title }}</h3>
              <h4 class="text-subtitle-1 text-primary mb-2">{{ item.subtitle }}</h4>
              <p class="text-body-2">{{ item.description }}</p>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card>

      <!-- Projects Section -->
      <v-card class="mb-12 pa-6" elevation="2">
        <h2 class="text-h3 font-weight-bold mb-6">Featured Projects</h2>
        <v-row>
          <v-col v-for="project in projects" :key="project.title" cols="12" md="6" lg="4">
            <v-card height="100%" class="d-flex flex-column">
              <v-img
                :src="isImageFailed(project.title) ? FALLBACK_IMAGE : project.image"
                :alt="isImageFailed(project.title) ? `${project.title} image unavailable` : project.imageAlt"
                height="160"
                cover
                class="flex-shrink-0"
                style="background-color: #f5f5f5;"
                @error="() => handleImageError(project.title)"
              />
              <v-card-title class="text-h6 font-weight-bold">{{ project.title }}</v-card-title>
              <v-card-text class="text-body-2 flex-grow-1">
                {{ project.description }}
                <v-chip-group class="mt-2" column selectable>
                  <v-chip
                    v-for="tech in project.tech"
                    :key="tech"
                    size="x-small"
                    variant="tonal"
                    class="mr-1"
                  >{{ tech }}</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :href="project.link"
                  target="_blank"
                  prepend-icon="mdi-github"
                  variant="text"
                  size="small"
                >View Code</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>