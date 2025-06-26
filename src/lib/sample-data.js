// Sample data that can be inserted through the frontend
export const sampleCompanyData = {
  nodes: [
    {
      name: "Blackcoffer ",
      type: "Company",
      properties: {
        industry: "Information Technology",
        founded: "2018",
        location: "Delhi, India",
        employees: "50",
        website: "https://Blackcoffer .com",
        revenue: "$2M",
        description:
          "Leading IT company specializing in data analytics and AI solutions",
      },
    },
    {
      name: "Rajesh Kumar",
      type: "Employee",
      properties: {
        role: "Senior Full Stack Developer",
        department: "Engineering",
        experience: "5",
        email: "rajesh.kumar@Blackcoffer .com",
        skills: "React, Node.js, Python, AWS",
        salary: "$75000",
        joinDate: "2022-01-15",
      },
    },
    {
      name: "Priya Sharma",
      type: "Employee",
      properties: {
        role: "Data Scientist",
        department: "Analytics",
        experience: "4",
        email: "priya.sharma@Blackcoffer .com",
        skills: "Python, Machine Learning, TensorFlow, SQL",
        salary: "$80000",
        joinDate: "2022-03-10",
      },
    },
    {
      name: "Amit Patel",
      type: "Employee",
      properties: {
        role: "DevOps Engineer",
        department: "Infrastructure",
        experience: "6",
        email: "amit.patel@Blackcoffer .com",
        skills: "Docker, Kubernetes, AWS, Jenkins",
        salary: "$85000",
        joinDate: "2021-11-20",
      },
    },
    {
      name: "Sneha Gupta",
      type: "Employee",
      properties: {
        role: "UI/UX Designer",
        department: "Design",
        experience: "3",
        email: "sneha.gupta@Blackcoffer .com",
        skills: "Figma, Adobe XD, Prototyping, User Research",
        salary: "$60000",
        joinDate: "2023-02-01",
      },
    },
    {
      name: "E-Commerce Analytics Platform",
      type: "Project",
      properties: {
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        budget: "$150000",
        technology: "React, Node.js, MongoDB",
        client: "RetailCorp",
        priority: "High",
        description: "Advanced analytics platform for e-commerce businesses",
      },
    },
    {
      name: "AI-Powered Chatbot",
      type: "Project",
      properties: {
        status: "Active",
        startDate: "2024-03-01",
        endDate: "2024-08-30",
        budget: "$80000",
        technology: "Python, TensorFlow, NLP",
        client: "TechStart Inc",
        priority: "Medium",
        description:
          "Intelligent chatbot system using natural language processing",
      },
    },
    {
      name: "Cloud Infrastructure Migration",
      type: "Project",
      properties: {
        status: "In Progress",
        startDate: "2024-02-10",
        endDate: "2024-09-15",
        budget: "$120000",
        technology: "AWS, Docker, Kubernetes",
        client: "Enterprise Solutions",
        priority: "High",
        description: "Migration of legacy systems to cloud infrastructure",
      },
    },
  ],
  relationships: [
    { sourceIndex: 0, targetIndex: 1, type: "EMPLOYS" },
    { sourceIndex: 0, targetIndex: 2, type: "EMPLOYS" },
    { sourceIndex: 0, targetIndex: 3, type: "EMPLOYS" },
    { sourceIndex: 0, targetIndex: 4, type: "EMPLOYS" },
    { sourceIndex: 0, targetIndex: 5, type: "OWNS" },
    { sourceIndex: 0, targetIndex: 6, type: "OWNS" },
    { sourceIndex: 0, targetIndex: 7, type: "OWNS" },
    { sourceIndex: 1, targetIndex: 5, type: "LEADS" },
    { sourceIndex: 2, targetIndex: 6, type: "LEADS" },
    { sourceIndex: 3, targetIndex: 7, type: "LEADS" },
    { sourceIndex: 1, targetIndex: 6, type: "WORKS_ON" },
    { sourceIndex: 1, targetIndex: 7, type: "WORKS_ON" },
    { sourceIndex: 2, targetIndex: 5, type: "WORKS_ON" },
    { sourceIndex: 4, targetIndex: 5, type: "WORKS_ON" },
    { sourceIndex: 4, targetIndex: 6, type: "WORKS_ON" },
  ],
};

// Cypher queries for manual insertion
export const sampleCypherQueries = `
// Create Company
CREATE (c:Company {
  name: "Blackcoffer ",
  industry: "Information Technology",
  founded: "2018",
  location: "Delhi, India",
  employees: "50",
  website: "https://Blackcoffer .com",
  revenue: "$2M"
})

// Create Employees
CREATE (e1:Employee {
  name: "Rajesh Kumar",
  role: "Senior Full Stack Developer",
  department: "Engineering",
  experience: "5",
  email: "rajesh.kumar@Blackcoffer .com",
  skills: "React, Node.js, Python, AWS"
})

CREATE (e2:Employee {
  name: "Priya Sharma",
  role: "Data Scientist",
  department: "Analytics",
  experience: "4",
  email: "priya.sharma@Blackcoffer .com",
  skills: "Python, Machine Learning, TensorFlow, SQL"
})

// Create Projects
CREATE (p1:Project {
  name: "E-Commerce Analytics Platform",
  status: "Active",
  startDate: "2024-01-15",
  budget: "$150000",
  technology: "React, Node.js, MongoDB"
})

// Create Relationships
MATCH (c:Company {name: "Blackcoffer "}), (e:Employee {name: "Rajesh Kumar"})
CREATE (c)-[:EMPLOYS]->(e)

MATCH (e:Employee {name: "Rajesh Kumar"}), (p:Project {name: "E-Commerce Analytics Platform"})
CREATE (e)-[:LEADS]->(p)

MATCH (c:Company {name: "Blackcoffer "}), (p:Project {name: "E-Commerce Analytics Platform"})
CREATE (c)-[:OWNS]->(p)
`;
