import linkCrmProject1 from "@/public/img/link-Crm-Project1.png";
import linkCrmProject2 from "@/public/img/link-Crm-Project2.png";
import Portfolio from "@/public/img/Portfolio.png";

export const projectsData = [
    {
        id: 1,
        title: 'Link CRM / Link ERP ',
        description:
            'A large-scale CRM/ERP web application developed as part of a professional team. Focused on building reusable components, complex forms, dashboards, and improving UI/UX for business workflows.',
        technologies: [
            'React',
            'Ant Design',
            'Redux Toolkit',
            'Axios',
            'JavaScript',
            'Vite',
        ],
        githubLink: null,
        liveLink: 'https://linkcrm.app/',
        image: linkCrmProject2,
    },
    {
        id: 2,
        title: 'Personal Portfolio Website',
        description:
            'A personal portfolio website to showcase projects, skills, and experience. Built with modern frontend tools and smooth animations.',
        technologies: [
            'React',
            'Vite',
            'Tailwind CSS',
            'Ant Design',
            'Framer Motion',
        ],
        githubLink: 'https://github.com/hamedAbdollahzade/hamedAbdollahzade.github.io',
        liveLink: 'https://hamedabdollahzade.github.io',
        image: Portfolio,
    },
];
