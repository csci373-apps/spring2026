# CSCI 373 Course Website

A modern, responsive course website built with Next.js, featuring markdown content support and Tailwind CSS styling.

## Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Markdown Support**: Easy content management using markdown files
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Navigation**: Intuitive navigation between course sections
- **Content Pages**: Syllabus, assignments, resources, and schedule

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd course-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
course-website/
├── content/                 # Markdown content files
│   ├── syllabus.md         # Course syllabus
│   ├── assignments.md      # Course assignments
│   └── resources.md        # Course resources
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── page.tsx       # Home page
│   │   ├── syllabus/      # Syllabus page
│   │   ├── assignments/   # Assignments page
│   │   ├── resources/     # Resources page
│   │   └── schedule/      # Schedule page
│   └── lib/               # Utility functions
│       └── markdown.ts    # Markdown parsing utilities
├── public/                 # Static assets
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Content Management

### Adding New Content

1. Create a new markdown file in the `content/` directory
2. Add frontmatter metadata at the top:
```markdown
---
title: "Page Title"
date: "2025-01-01"
excerpt: "Brief description"
---
```

3. Create a corresponding page in `src/app/` directory
4. Use the `getPostData()` function to render the markdown content

### Markdown Features

The website supports standard markdown syntax:
- Headers (# ## ###)
- Lists (bulleted and numbered)
- Links and images
- Bold and italic text
- Code blocks
- Tables

## Customization

### Styling

- Modify `tailwind.config.ts` to customize colors, fonts, and spacing
- Update `src/app/globals.css` for global styles
- Use Tailwind CSS classes for component styling

### Navigation

- Edit `src/app/layout.tsx` to modify the navigation menu
- Add or remove navigation links as needed

### Layout

- Adjust the main container width in `layout.tsx`
- Modify page layouts in individual page components

## Deployment

### Build for Production

```bash
npm run build
```

