import React, {useState} from 'react';
import {Typography, Card, Tag, Button, Input} from 'antd';
import {GithubOutlined, LinkOutlined, SearchOutlined} from '@ant-design/icons';
import {motion} from 'motion/react';
import {projectsData} from '../data/projectsData';


const {Title, Paragraph} = Typography;

export default function Projects() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projectsData.filter(
        (project) =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies.some((tech) =>
                tech.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.5},
        },
    };

    const ProjectCard = ({project}) => (
        <motion.div variants={itemVariants} whileHover={{y: -8}} transition={{type: 'spring', stiffness: 300}}>
            <Card
                hoverable
                cover={
                    <div className="h-48 mt-2 overflow-hidden">
                        <img
                            alt={project.title}
                            src={project.image}
                            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                }
                className="h-full flex flex-col"
            >
                <Title level={4} className="!mb-3 dark:!text-white">{project.title}</Title>
                <Paragraph className="text-gray-600 dark:text-gray-400 !mb-4 flex-grow">
                    {project.description}
                </Paragraph>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                        <Tag key={tech} color="blue" className="!m-0">
                            {tech}
                        </Tag>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<GithubOutlined/>}
                        href={project.githubLink}
                        target="_blank"
                        className="flex-1"
                    >
                        Code
                    </Button>
                    <Button
                        icon={<LinkOutlined/>}
                        href={project.liveLink}
                        target="_blank"
                        className="flex-1"
                    >
                        Live Demo
                    </Button>
                </div>
            </Card>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-16"
                >
                    <Title level={1} className="dark:!text-white">
                        My Projects
                    </Title>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-6"/>
                    <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Here are some of my recent projects. Each one represents a unique challenge and learning
                        experience.
                    </Paragraph>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="mb-12 max-w-xl mx-auto"
                >
                    <Input
                        size="large"
                        placeholder="Search projects by name, description, or technology..."
                        prefix={<SearchOutlined className="text-gray-400"/>}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-lg"
                    />
                </motion.div>

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project}/>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <Title level={3} className="dark:!text-white">No projects found</Title>
                        <Paragraph className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search criteria
                        </Paragraph>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.4}}
                    className="mt-20 text-center"
                >
                    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0">
                        <Title level={2} className="!text-white !mb-4">
                            Interested in collaborating?
                        </Title>
                        <Paragraph className="text-white/90 !mb-6 text-lg">
                            I'm always open to discussing new projects and opportunities.
                        </Paragraph>
                        <Button size="large" href="/contact" className="h-12 px-8">
                            Get In Touch
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
