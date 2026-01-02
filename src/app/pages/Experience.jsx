import React from 'react';
import {Typography, Timeline, Card, Tag} from 'antd';
import {BookOutlined, DownloadOutlined} from '@ant-design/icons';
import {motion} from 'motion/react';
import {experienceData} from '../data/experienceData';
import Resume from "@/public/Resume.pdf";


const {Title, Paragraph} = Typography;

export default function Experience() {
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {staggerChildren: 0.2},
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, x: -20},
        visible: {
            opacity: 1,
            x: 0,
            transition: {duration: 0.5},
        },
    };

    const workExperience = experienceData.filter((item) => item.type === 'work');
    const education = experienceData.filter((item) => item.type === 'education');

    const ExperienceCard = ({item}) => (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <Title level={4} className="!mb-1 dark:!text-white">
                        {item.title}
                    </Title>
                    <Paragraph className="!mb-1 text-blue-500 font-medium">
                        {item.company}
                    </Paragraph>
                    <Paragraph className="!mb-0 text-gray-500 dark:text-gray-400 text-sm">
                        {item.location}
                    </Paragraph>
                </div>
                <Tag color="blue">{item.period}</Tag>
            </div>

            <Paragraph className="text-gray-700 dark:text-gray-300 !mb-4">
                {item.description}
            </Paragraph>

            <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                ))}
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-16"
                >
                    <Title level={1} className="dark:!text-white">
                        Experience & Education
                    </Title>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-6"/>
                    <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        My professional journey as a Frontend Developer
                    </Paragraph>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Work Experience */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                {/*<BriefcaseOutlined className="text-white text-xl" />*/}
                            </div>
                            <Title level={2} className="!mb-0 dark:!text-white">
                                Work Experience
                            </Title>
                        </div>

                        <Timeline
                            mode="left"
                            items={workExperience.map((item, index) => ({
                                key: item.id,
                                dot: (
                                    <motion.div
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        transition={{delay: index * 0.2}}
                                        className="w-4 h-4 bg-blue-500 rounded-full"
                                    />
                                ),
                                children: (
                                    <motion.div variants={itemVariants}>
                                        <ExperienceCard item={item}/>
                                    </motion.div>
                                ),
                            }))}
                        />
                    </motion.div>

                    {/* Education */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                <BookOutlined className="text-white text-xl"/>
                            </div>
                            <Title level={2} className="!mb-0 dark:!text-white">
                                Education
                            </Title>
                        </div>

                        <Timeline
                            mode="left"
                            items={education.map((item, index) => ({
                                key: item.id,
                                dot: (
                                    <motion.div
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        transition={{delay: index * 0.2}}
                                        className="w-4 h-4 bg-purple-500 rounded-full"
                                    />
                                ),
                                children: (
                                    <motion.div variants={itemVariants}>
                                        <ExperienceCard item={item}/>
                                    </motion.div>
                                ),
                            }))}
                        />
                    </motion.div>
                </div>

                {/* Certifications */}
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.4}}
                    className="mt-16"
                >
                    <Card>
                        <Title level={3} className="!mb-6 dark:!text-white">
                            Courses & Certifications
                        </Title>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Frontend Bootcamp (React & Modern JS)',
                                    issuer: 'Farawin Bootcamp',
                                    year: '2023',
                                },
                                {
                                    title: 'JavaScript & Node.js Intensive Course',
                                    issuer: 'Farawin Bootcamp',
                                    year: '2023',
                                },
                                {
                                    title: 'Responsive Web Design',
                                    issuer: 'Self-Taught',
                                    year: '2022',
                                },
                            ].map((cert, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{scale: 1.05}}
                                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="text-3xl mb-3">🎓</div>
                                    <Title level={5} className="!mb-2 dark:!text-white">
                                        {cert.title}
                                    </Title>
                                    <Paragraph className="!mb-1 text-gray-600 dark:text-gray-400 text-sm">
                                        {cert.issuer}
                                    </Paragraph>
                                    <Tag color="blue">{cert.year}</Tag>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Resume CTA */}
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.6}}
                    className="mt-12 text-center"
                >
                    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0">
                        <Title level={3} className="!text-white !mb-4">
                            Want to know more?
                        </Title>
                        <Paragraph className="text-white/90 !mb-6">
                            Download my complete resume for detailed information
                        </Paragraph>

                        <a
                            href={Resume}
                            download
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <DownloadOutlined/>
                            Download Resume
                        </a>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
