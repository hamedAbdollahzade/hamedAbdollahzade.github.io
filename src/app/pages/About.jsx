import React from 'react';
import {Typography, Card, Progress, Tabs} from 'antd';
import {motion} from 'motion/react';
import {skillsData} from '../data/skillsData';
import profilePic from "@/public/img/photo_2025-12-05_20-23-22.jpg"

const {Title, Paragraph} = Typography;

/* =======================
   Animation Variants
======================= */
const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {staggerChildren: 0.1},
    },
};

const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.5, ease: 'easeOut'},
    },
};

/* =======================
   Skill Card
======================= */
const SkillCard = ({skill}) => (
    <motion.div variants={itemVariants} whileHover={{scale: 1.03}}>
        <Card className="mb-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
            {skill.name}
          </span>
                </div>
                <span className="text-blue-500 font-semibold">
          {skill.level}%
        </span>
            </div>
            <Progress
                percent={skill.level}
                showInfo={false}
                strokeColor={{
                    '0%': '#3b82f6',
                    '100%': '#8b5cf6',
                }}
            />
        </Card>
    </motion.div>
);

export default function About() {
    const tabItems = [
        {
            key: 'frontend',
            label: (
                <span className="text-base px-2">
          💻 Frontend
        </span>
            ),
            children: (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {skillsData.frontend.map((skill) => (
                        <SkillCard key={skill.name} skill={skill}/>
                    ))}
                </motion.div>
            ),
        },
        {
            key: 'tools',
            label: (
                <span className="text-base px-2">
          🛠️ Tools
        </span>
            ),
            children: (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {skillsData.tools.map((skill) => (
                        <SkillCard key={skill.name} skill={skill}/>
                    ))}
                </motion.div>
            ),
        },
        {
            key: 'uiux',
            label: (
                <span className="text-base px-2">
          🎨 UI / UX
        </span>
            ),
            children: (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {skillsData.uiux.map((skill) => (
                        <SkillCard key={skill.name} skill={skill}/>
                    ))}
                </motion.div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ================= Header ================= */}
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-16"
                >
                    <Title level={1} className="dark:!text-white">
                        About Me
                    </Title>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mt-2"/>
                </motion.div>

                {/* ================= Profile & Summary ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Profile */}
                    <motion.div
                        initial={{opacity: 0, x: -40}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6}}
                    >
                        <Card className="h-full">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-44 h-44 rounded-full overflow-hidden mb-6 ring-4 ring-blue-500/20">
                                    <img
                                        src={profilePic}
                                        alt="Hamed Abdollahzade"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <Title level={3} className="!mb-1 dark:!text-white">
                                    Hamed Abdollahzade
                                </Title>
                                <Paragraph className="text-gray-600 dark:text-gray-400 !mb-4">
                                    Frontend Developer
                                </Paragraph>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['React', 'Next Js', 'Tailwind CSS', 'Ant Design'].map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        >
                      {tech}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{opacity: 0, x: 40}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6}}
                    >
                        <Card className="h-full">
                            <Title level={3} className="!mb-4 dark:!text-white">
                                Professional Summary
                            </Title>

                            <Paragraph className="text-gray-700 dark:text-gray-300">
                                I’m a frontend developer with around 3 years of hands-on
                                experience building modern web applications using React and
                                Next Js . I focus on creating clean, maintainable code and
                                intuitive user interfaces.
                            </Paragraph>

                            <Paragraph className="text-gray-700 dark:text-gray-300">
                                I have experience working in team environments, building
                                dashboards and internal tools, and collaborating with backend
                                developers to deliver scalable solutions.
                            </Paragraph>

                            <Paragraph className="text-gray-700 dark:text-gray-300 !mb-0">
                                I’m constantly learning new technologies and best practices,
                                and I enjoy improving both performance and user experience in
                                the products I work on.
                            </Paragraph>
                        </Card>
                    </motion.div>
                </div>

                {/* ================= Skills ================= */}
                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <Card>
                        <Title level={3} className="!mb-6 dark:!text-white">
                            Skills & Expertise
                        </Title>
                        <Tabs
                            defaultActiveKey="frontend"
                            items={tabItems}
                            size="large"
                        />
                    </Card>
                </motion.div>

                {/* ================= Quick Facts ================= */}
                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: '🎯',
                            title: 'Focus',
                            description: 'Clean code, performance and maintainability',
                        },
                        {
                            icon: '💡',
                            title: 'Mindset',
                            description: 'Continuous learning and problem solving',
                        },
                        {
                            icon: '⚡',
                            title: 'Strength',
                            description: 'Modern frontend frameworks and UI systems',
                        },
                    ].map((item) => (
                        <motion.div
                            key={item.title}
                            whileHover={{scale: 1.05}}
                        >
                            <Card className="text-center h-full hover:shadow-lg transition-shadow">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <Title level={4} className="!mb-2 dark:!text-white">
                                    {item.title}
                                </Title>
                                <Paragraph className="text-gray-600 dark:text-gray-400 !mb-0">
                                    {item.description}
                                </Paragraph>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
