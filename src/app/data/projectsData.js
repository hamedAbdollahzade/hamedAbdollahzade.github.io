import linkCrmProject1 from "@/public/img/link-Crm-Project1.png";
import Portfolio from "@/public/img/Portfolio.png";
import linkCrmProject2 from "@/public/img/link-Crm-Project2.png";
import WikiQAdmin from "@/public/img/wiqiQ (1).png";
import Messenger from "@/public/img/Messenger.png";
import Messenger2 from "@/public/img/Messenger2.png";

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
        title: 'WikiQ Admin Panel',
        description:
            'Contributed to the development of the WikiQ Admin Panel, focusing on managing platform content and internal workflows with a clean, modern, and scalable frontend architecture.',
        technologies: [
            'React',
            'Vite',
            'Tailwind CSS',
            'Context API',
        ],
        githubLink: null,
        liveLink: 'https://wikiq.co/',
        image: WikiQAdmin,
    },
    {
        id: 3,
        title: 'Messenger Application',
        description:
            'A messenger application developed as a first hands-on project for learning React during a bootcamp. The project focuses on building a modular, responsive UI and integrating with a real messaging API for sending and receiving messages.',
        technologies: [
            'React',
            'Vite',
            'Tailwind CSS',
            'Farawin API',
        ],
        githubLink: 'https://github.com/hamedAbdollahzade/messanger',
        liveLink: "https://hamedabdollahzade.github.io/messanger/",
        image: Messenger,
    }


];
