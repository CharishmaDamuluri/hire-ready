export interface EvalTestCase {
  id: string;
  description: string; // what this test case is checking
  resume: string; // the resume text
  jobDescription: string; // the job description

  // Reference-based expectations
  expected: {
    scoreRange: [number, number]; // acceptable score range e.g. [70, 90]
    mustHaveSkills: string[]; // skills that MUST appear in matchedSkills
    mustMissSkills: string[]; // skills that MUST appear in missingSkills
    verdict: string[]; // acceptable verdicts e.g. ['strong fit', 'good fit']
  };
}

export const evalDataset: EvalTestCase[] = [
  {
    id: "test-1",
    description: "Strong frontend match — React role vs React engineer",
    resume: `Sam Test| samtest@email.com
    SKILLS: React, TypeScript, Node.js, GraphQL, Jest, CSS
      
      EXPERIENCE:
      Senior Frontend Engineer — Stripe (2021–Present)
      • Built React component library used by 50+ engineers
      • Reduced bundle size by 40% using code splitting
      • Led migration from JavaScript to TypeScript across 3 apps
      
      Frontend Engineer — Airbnb (2019–2021)  
      • Developed booking flow in React serving 10M users
      • Implemented GraphQL client reducing API calls by 30%`,
    jobDescription: `Senior Frontend Engineer
      
      Requirements:
      • 4+ years React experience
      • TypeScript proficiency
      • Experience with GraphQL
      • Testing with Jest or similar
      • Strong CSS skills
      
      Nice to have:
      • AWS experience
      • Python knowledge`,
    expected: {
      scoreRange: [85, 100],
      mustHaveSkills: ["React", "TypeScript", "GraphQL", "Jest"],
      mustMissSkills: [],
      verdict: ["strong fit"],
    },
  },
  {
    id: "test-2",
    description: "Weak match — frontend engineer vs ML role",
    resume: `
      Bob Test | bobtest@email.com
      
      SKILLS: React, TypeScript, HTML, CSS, JavaScript
      
      EXPERIENCE:
      Frontend Developer — Startup (2022–Present)
      • Built responsive web applications in React
      • Implemented REST API integrations
    `,
    jobDescription: `
      Machine Learning Engineer
      
      Requirements:
      • Python proficiency
      • PyTorch or TensorFlow experience
      • Experience training neural networks
      • Statistics and linear algebra background
      • MLOps experience (MLflow, Kubeflow)
    `,
    expected: {
      scoreRange: [0, 30],
      mustHaveSkills: [],
      mustMissSkills: ["Python", "PyTorch", "TensorFlow"],
      verdict: ["weak fit"],
    },
  },
  {
    id: "test-3",
    description: "Partial match — some skills present, some missing",
    resume: `
      Alex Test | alextest@email.com
      
      SKILLS: JavaScript, React, Node.js, SQL, Git
      
      EXPERIENCE:
      Full Stack Developer — Agency (2021–Present)
      • Built full stack apps with React and Node.js
      • Designed PostgreSQL schemas for client projects
      • Deployed apps to AWS EC2
    `,
    jobDescription: `
      Backend Engineer
      
      Requirements:
      • Python or Go proficiency
      • Kubernetes experience
      • Microservices architecture
      • AWS or GCP
      • SQL databases
      
      Nice to have:
      • React experience
      • CI/CD pipelines
    `,
    expected: {
      scoreRange: [10, 45],
      mustHaveSkills: ["SQL", "AWS"],
      mustMissSkills: ["Python", "Kubernetes"],
      verdict: ["partial fit", "weak fit"],
    },
  },
];
