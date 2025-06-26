# Neo4j Knowledge Graph Dashboard

A comprehensive web application for managing and visualizing Neo4j knowledge graphs with user authentication, data management, and interactive graph visualization.

## 🚀 Features

### 🔐 Authentication System

- **User Registration & Login** with Supabase Auth
- **Password Reset** functionality
- **Profile Management** with user data
- **Protected Routes** with middleware
- **Role-based Access** control

### 📊 Data Management

- **Neo4j Integration** for graph database operations
- **Node Management** - Create, Read, Update, Delete nodes
- **Relationship Management** - Manage connections between nodes
- **Advanced Search** with filters and sorting
- **Data Visualization** with interactive graphs
- **Bulk Operations** for efficient data handling

### 🎨 User Interface

- **Responsive Design** with Tailwind CSS
- **Modern UI Components** with shadcn/ui
- **Interactive Dashboard** with statistics
- **Search & Filter** capabilities
- **Teal Color Scheme** throughout the application

### 🔍 Search & Analytics

- **Global Search** across nodes and relationships
- **Advanced Filtering** by type, properties, and dates
- **Search Results** with detailed views
- **Graph Visualization** of connections
- **Export Functionality** for data

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Neo4j (Graph), Supabase (User Data)
- **UI Components**: shadcn/ui, Lucide Icons
- **Styling**: Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git
- Neo4j Database (local or cloud)
- Supabase Account

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/neo4j-knowledge-graph.git
cd neo4j-knowledge-graph
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install

# or

yarn install
\`\`\`

### 3. Environment Variables Setup

Create a \`.env.local\` file in the root directory:

\`\`\`env

# Neo4j Configuration

NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Database Setup

#### Neo4j Setup

1. Install Neo4j Desktop or use Neo4j Aura (cloud)
2. Create a new database
3. Update the connection details in \`.env.local\`
4. Ensure the database is running

#### Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the following queries:

\`\`\`sql
-- Create profiles table
CREATE TABLE public.profiles (
id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
email TEXT UNIQUE NOT NULL,
name TEXT,
age INTEGER,
phone TEXT,
role TEXT,
type TEXT CHECK (type IN ('Company', 'Employee', 'Project', 'Department')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for users based on user_id" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL,
subject TEXT NOT NULL,
message TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
FOR INSERT WITH CHECK (true);

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS \$\$
BEGIN
INSERT INTO public.profiles (id, email, name, age, phone, role, type, created_at, updated_at)
VALUES (
new.id,
new.email,
COALESCE(new.raw_user_meta_data->>'name', ''),
CASE
WHEN new.raw_user_meta_data->>'age' IS NOT NULL AND new.raw_user_meta_data->>'age' != ''
THEN (new.raw_user_meta_data->>'age')::integer
ELSE NULL
END,
COALESCE(new.raw_user_meta_data->>'phone', ''),
COALESCE(new.raw_user_meta_data->>'role', ''),
COALESCE(new.raw_user_meta_data->>'type', ''),
NOW(),
NOW()
);
RETURN new;
EXCEPTION
WHEN others THEN
RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
RETURN new;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
neo4j-knowledge-graph/
├── app/ # Next.js App Router
│ ├── api/ # API routes
│ ├── dashboard/ # Dashboard pages
│ ├── details/ # Detail pages
│ ├── login/ # Authentication pages
│ └── ...
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ ├── navbar.jsx # Navigation components
│ ├── graph-visualization.jsx # Graph visualization
│ └── ...
├── lib/ # Utility libraries
│ ├── neo4j.js # Neo4j connection
│ ├── supabase.js # Supabase client
│ └── ...
├── public/ # Static assets
└── ...
\`\`\`

## 🚀 Deployment

### Deploy

1. **Push to GitHub** (see instructions below)

### Environment Variables for Production

Add these in your dashboard:

- \`NEO4J_URI\`
- \`NEO4J_USERNAME\`
- \`NEO4J_PASSWORD\`
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`SUPABASE_SERVICE_ROLE_KEY\`
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\` (your production URL)

## 📤 Upload to GitHub

### 1. Create a New Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it \`neo4j-knowledge-graph\`
4. Don't initialize with README (we already have one)

### 2. Initialize Git and Push

\`\`\`bash

# Initialize git repository

git init

# Add all files

git add .

# Create initial commit

git commit -m "Initial commit: Neo4j Knowledge Graph Dashboard"

# Add remote origin (replace with your GitHub URL)

git remote add origin https://github.com/yourusername/neo4j-knowledge-graph.git

# Push to GitHub

git branch -M main
git push -u origin main
\`\`\`

### 3. Future Updates

\`\`\`bash

# Add changes

git add .

# Commit changes

git commit -m "Description of changes"

# Push to GitHub

git push
\`\`\`

## 🎯 Usage

### 1. **User Registration**

- Visit \`/signup\` to create a new account
- Fill in your details (name, email, age, phone, role, type)
- Verify your email (if email verification is enabled)

### 2. **Dashboard Access**

- Login at \`/login\`
- Access the dashboard at \`/dashboard\`
- View statistics and manage data

### 3. **Data Management**

- **Nodes**: Create, edit, and delete nodes
- **Relationships**: Manage connections between nodes
- **Search**: Use global search to find specific data
- **Visualization**: View interactive graph representations

### 4. **Profile Management**

- Update your profile at \`/profile\`
- Change password and personal information
- View account statistics

## 🔧 Configuration

### Neo4j Configuration

- Update connection details in \`.env.local\`
- Ensure proper authentication credentials
- Test connection in the dashboard

### Supabase Configuration

- Set up authentication providers
- Configure email templates
- Set up row-level security policies

## 🐛 Troubleshooting

### Common Issues

1. **Neo4j Connection Error**

   - Check if Neo4j is running
   - Verify connection credentials
   - Ensure network connectivity

2. **Supabase Authentication Issues**

   - Verify API keys are correct
   - Check if email confirmation is required
   - Ensure RLS policies are set up correctly

3. **Build Errors**
   - Clear \`.next\` folder and rebuild
   - Check for missing dependencies
   - Verify environment variables

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure databases are properly configured

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact via the contact form in the application
- Email: your-email@example.com

---

**Built with ❤️ using Next.js, Neo4j, and Supabase**
\`\`\`

This README provides comprehensive documentation for setting up, deploying, and using your Neo4j Knowledge Graph Dashboard project.
