import React from 'react';
import {Button, Card, Tag, Typography} from 'antd';
import {
    ArrowRightOutlined, DownloadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined, RocketOutlined,
} from '@ant-design/icons';
import {motion, useScroll, useTransform} from 'motion/react';
import {useTranslation} from 'react-i18next';
import {useLanguage} from '../../contexts/LanguageContext';
import Resume from '@/public/Resume.pdf';
import profilePic from '@/public/img/office-profile-sm.png';
import {sections} from '@/app/data/sections.js';
import {projectsData} from '@/app/data/projectsData.js';
import {skillsData} from '@/app/data/skillsData.js';
import {experienceData} from '@/app/data/experienceData.js';

const {Title, Paragraph} = Typography;

const fadeUp = {
    hidden: {opacity: 0, y: 54, filter: 'blur(10px)'}, visible: {
        opacity: 1, y: 0, filter: 'blur(0px)', transition: {duration: 0.75, ease: [0.22, 1, 0.36, 1]},
    },
};

const stagger = {
    hidden: {}, visible: {transition: {staggerChildren: 0.1, delayChildren: 0.08}},
};

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const SectionHeader = ({eyebrow, title, description}) => (<motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{once: true, margin: '-80px'}}
    className="mx-auto mb-12 max-w-3xl text-center"
>
    <span className="portfolio-eyebrow">{eyebrow}</span>
    <Title level={2} className="!mt-4 !text-4xl md:!text-5xl dark:!text-white">
        {title}
    </Title>
    <Paragraph className="mx-auto !mb-0 max-w-2xl text-base md:text-lg text-slate-600 dark:text-slate-300">
        {description}
    </Paragraph>
</motion.div>);

const RevealCard = ({children, className = '', delay = 0}) => (<motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{once: true, margin: '-60px'}}
    transition={{delay}}
    whileHover={{y: -8, scale: 1.01}}
    className={className}
>
    {children}
</motion.div>);

export default function Home() {
    const {t} = useTranslation();
    const {isRTL} = useLanguage();
    const {scrollYProgress} = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -130]);
    const heroScale = useTransform(scrollYProgress, [0, 0.24], [1, 0.92]);
    const orbY = useTransform(scrollYProgress, [0, 1], [0, 520]);

    const featuredProjects = projectsData;
    const skillCloud = [...skillsData.frontend, ...skillsData.tools].slice(0, 14);
    const workItems = experienceData.filter((item) => item.type === 'work');


    return (<main className="portfolio-shell min-h-screen overflow-hidden bg-slate-950 text-white">
        <motion.div style={{scaleX: scrollYProgress}} className="scroll-progress"/>
        <motion.div style={{y: orbY}} className="aurora aurora-one"/>
        <motion.div style={{y: useTransform(scrollYProgress, [0, 1], [0, -360])}} className="aurora aurora-two"/>

        <section id="home" className="relative min-h-screen px-4  pt-12 sm:px-6 lg:px-8">
            <motion.div
                style={{y: heroY, scale: heroScale}}
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="mx-auto grid max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20"
            >
                <motion.div variants={fadeUp}
                            className={isRTL ? 'text-center lg:text-right' : 'text-center lg:text-left'}>
                    <div
                        className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-cyan-100 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"/>
                        Available for modern frontend products
                    </div>

                    <Title
                        className="!mb-5 !text-5xl !font-black !leading-[0.95] tracking-[-0.06em] !text-white sm:!text-6xl lg:!text-8xl">
                        {t('hero.name')}
                        <span
                            className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                                Frontend Engineer
                            </span>
                    </Title>

                    <Paragraph className="mx-auto !mb-8 max-w-2xl text-lg leading-8 !text-slate-300 lg:mx-0">
                        {t('hero.description')} I design fast, polished interfaces with React, enterprise
                        dashboards,
                        motion systems, and scalable component architecture.
                    </Paragraph>

                    <div className="mb-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Button
                            type="primary"
                            size="large"
                            icon={<RocketOutlined/>}
                            onClick={() => scrollToSection('projects')}
                            className="portfolio-primary-btn"
                        >
                            View Projects
                        </Button>
                        <a href={Resume} download className="portfolio-secondary-btn">
                            <DownloadOutlined/> Download Resume
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                        {['React', 'Next.js', 'TypeScript', 'Ant Design', 'Tailwind', 'Motion UI'].map((tech) => (
                            <span key={tech} className="tech-pill">{tech}</span>))}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-lg">
                    <div className="hero-card group">
                        <div className="hero-card-grid"/>
                        <motion.div
                            // animate={{rotate: [0, 2.5, -2.5, 0], y: [0, -10, 0]}}
                            // transition={{duration: 7, repeat: Infinity, ease: 'easeInOut'}}
                            className="relative z-10 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 backdrop-blur"
                        >
                            <img src={profilePic} alt="Hamed Abdollahzade"
                                 className="aspect-[4/5] w-full rounded-[1.4rem] object-cover"/>
                        </motion.div>
                        <motion.div
                            animate={{x: [0, 16, 0], y: [0, -12, 0]}}
                            transition={{duration: 5, repeat: Infinity, ease: 'easeInOut'}}
                            className="floating-metric right-[-1rem] top-12"
                        >
                            <strong>4+</strong><span>Years Practice</span>
                        </motion.div>
                        <motion.div
                            animate={{x: [0, -12, 0], y: [0, 14, 0]}}
                            transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
                            className="floating-metric bottom-10 left-[-1rem]"
                        >
                            <strong>15+</strong><span>Projects Built</span>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4"
            >
                {[['Performance', 'Core Web Vitals mindset'], ['Design Systems', 'Reusable UI foundations'], ['Dashboards', 'Complex forms and data flows'], ['Motion', 'Scroll-aware storytelling'],].map(([title, text]) => (
                    <motion.div key={title} variants={fadeUp} className="bento-stat">
                        <span>{title}</span>
                        <p>{text}</p>
                    </motion.div>))}
            </motion.div>
        </section>

        <section id="about" className="scroll-section px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeader
                eyebrow="About"
                title="A portfolio built like a product experience."
                description="Clean architecture, responsive craft, accessible interactions, and just enough motion to make the story memorable."
            />
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <RevealCard>
                    <Card className="glass-card h-full">
                        <Title level={3} className="dark:!text-white">Professional Summary</Title>
                        <Paragraph className="!text-slate-300">
                            Frontend developer focused on React, Next.js, enterprise UI, API integration, and
                            building maintainable interfaces for real products.
                        </Paragraph>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {['Clean Code', 'Responsive UI', 'REST APIs', 'Team Workflow'].map((item) => (
                                <div key={item} className="mini-tile">{item}</div>))}
                        </div>
                    </Card>
                </RevealCard>
                <RevealCard delay={0.08}>
                    <Card className="glass-card h-full">
                        <Title level={3} className="dark:!text-white">Skill Stack</Title>
                        <div className="flex flex-wrap gap-3">
                            {skillCloud.map((skill) => (
                                <Tag key={skill.name} className="skill-tag">{skill.icon} {skill.name}</Tag>))}
                        </div>
                    </Card>
                </RevealCard>
            </div>
        </section>

        <section id="projects" className="scroll-section px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeader
                eyebrow="Selected Work"
                title="Featured projects with polished presentation."
                description="Project cards reveal on scroll, highlight real product work, and keep actions clear for recruiters and collaborators."
            />
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
                {featuredProjects.map((project, index) => (<RevealCard key={project.id} delay={index * 0.05}>
                    <Card className="project-card h-full" cover={<div className="project-image-wrap">
                        <img src={project.image} alt={project.title} className="project-image"/>
                    </div>}>
                        <Title level={4} className="dark:!text-white">{project.title}</Title>
                        <Paragraph className="!text-slate-300">{project.description}</Paragraph>
                        <div className="mb-5 flex flex-wrap gap-2">
                            {project.technologies.slice(0, 5).map((tech) => <Tag key={tech}>{tech}</Tag>)}
                        </div>
                        <div className="flex gap-3">

                            {project.githubLink && <Button href={project.githubLink} target="_blank"
                                                           icon={<GithubOutlined/>}>Code</Button>}

                            {project.fontEndLink && <Button href={project.fontEndLink} target="_blank"
                                                            icon={<GithubOutlined/>}>FontEnd Code</Button>}

                            {project.backendLink && <Button href={project.backendLink} target="_blank"
                                                            icon={<GithubOutlined/>}>BackEnd Code</Button>}

                            {project.liveLink && (<Button type="primary" href={project.liveLink} target="_blank"
                                                          icon={<ArrowRightOutlined/>}>Visit</Button>)}

                        </div>
                    </Card>
                </RevealCard>))}
            </div>
        </section>

        <section id="experience" className="scroll-section px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeader
                eyebrow="Experience"
                title="Real-world frontend delivery."
                description="A concise timeline focused on product impact, collaboration, and modern React engineering."
            />
            <div className="mx-auto max-w-5xl space-y-5">
                {workItems.map((item, index) => (<RevealCard key={item.id} delay={index * 0.06}>
                    <div className="timeline-card">
                        <div className="timeline-dot"/>
                        <div>
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                <h3>{item.title} · {item.company}</h3>
                                <span>{item.period}</span>
                            </div>
                            <p>{item.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.technologies.map((tech) => <Tag key={tech}>{tech}</Tag>)}
                            </div>
                        </div>
                    </div>
                </RevealCard>))}
            </div>
        </section>

        <section className="scroll-section px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeader
                eyebrow="Roadmap"
                title="How I keep growing as a frontend engineer."
                description="A compact roadmap that signals depth: fundamentals, React ecosystem, product quality, and production readiness."
            />
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
                {sections.map((section) => (<motion.div key={section.title} variants={fadeUp} className="roadmap-card">
                    <h3>{section.title}</h3>
                    <ul>
                        {section.items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </motion.div>))}
            </motion.div>
        </section>

        <section id="contact" className="scroll-section px-4 py-24 sm:px-6 lg:px-8">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/20 to-amber-400/20 p-8 text-center shadow-2xl shadow-cyan-500/10 backdrop-blur-xl md:p-14"
            >
                <span className="portfolio-eyebrow">Contact</span>
                <Title className="!mt-4 !text-4xl md:!text-6xl !text-white">Let’s build something sharp.</Title>
                <Paragraph className="mx-auto max-w-2xl !text-lg !text-slate-300">
                    Available for frontend roles, freelance dashboards, landing pages, and React product interfaces.
                </Paragraph>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button type="primary" size="large" href="mailto:hamedabdollahzade.ab@gmail.com"
                            icon={<MailOutlined/>}>Email Me</Button>
                    <Button size="large" href="tel:+989107902735" icon={<PhoneOutlined/>}>Call</Button>
                    <Button size="large" href="https://github.com/hamedAbdollahzade" target="_blank"
                            icon={<GithubOutlined/>}>GitHub</Button>
                    <Button size="large" href="https://www.linkedin.com/in/hamed-abdollahzade/" target="_blank"
                            icon={<LinkedinOutlined/>}>LinkedIn</Button>
                </div>
            </motion.div>
        </section>
    </main>);
}
