import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Typography} from 'antd';
import {
    DownloadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined, RocketOutlined,
} from '@ant-design/icons';
import {motion} from 'motion/react';
import Resume from "@/public/Resume.pdf";
import profilePic from "@/public/img/office-profile-sm.png"


const {Title, Paragraph} = Typography;

/* =======================
   Animation Variants
======================= */
const containerVariants = {
    hidden: {opacity: 0}, visible: {
        opacity: 1, transition: {staggerChildren: 0.2},
    },
};

const itemVariants = {
    hidden: {opacity: 0, y: 24}, visible: {
        opacity: 1, y: 0, transition: {duration: 0.5, ease: 'easeOut'},
    },
};

export default function Home() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-[calc(100vh-4rem)] flex flex-col  items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    {/* ================= Text Section ================= */}
                    <motion.div variants={itemVariants} className="text-center lg:text-left">
                        <motion.div
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            transition={{type: 'spring', stiffness: 180, delay: 0.15}}
                            className="inline-block mb-5 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30"
                        >
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                👋 Welcome to my portfolio
              </span>
                        </motion.div>

                        <Title level={1} className="!text-5xl lg:!text-6xl !mb-4 dark:!text-white">
                            Hi, I’m
                            <span
                                className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hamed Abdollahzade
              </span>
                        </Title>

                        <Title
                            level={2}
                            className="!text-2xl lg:!text-3xl !mb-6 !text-gray-600 dark:!text-gray-300 !font-normal"
                        >
                            Frontend Developer (React & Next Js)
                        </Title>

                        <Paragraph className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                            I’m a frontend developer focused on building modern, fast and maintainable
                            web applications. I enjoy working with React, Tailwind CSS and Ant Design,
                            and I care deeply about clean code and good user experience.
                        </Paragraph>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                            <Button
                                type="primary"
                                size="large"
                                icon={<RocketOutlined/>}
                                onClick={() => navigate('/projects')}
                                className=" px-8"
                            >
                                View Projects
                            </Button>

                            <Button
                                type="default"
                                size="large"
                                icon={<DownloadOutlined/>}
                                className=""
                            >
                                <a
                                    href={Resume}
                                    download
                                    className="inline-flex items-center gap-2 px-4  bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Download Resume
                                </a>
                            </Button>


                        </div>

                        <div className="flex gap-4 justify-center lg:justify-start">
                            <Button
                                type="text"
                                size="large"
                                icon={<GithubOutlined/>}
                                href="https://github.com/hamedAbdollahzade"
                                target="_blank"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                            />
                            <Button
                                type="text"
                                size="large"
                                icon={<LinkedinOutlined/>}
                                href="https://linkedin.com"
                                target="_blank"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                            />
                            <Button
                                type="text"
                                size="large"
                                icon={<MailOutlined/>}
                                href="mailto:hamedabdollahzade.ab@gmail.com"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                            />
                        </div>
                    </motion.div>

                    {/* ================= Image Section ================= */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden"
                    >
                        <motion.div
                            animate={{x: [0, 10, 0]}}
                            transition={{duration: 3, repeat: Infinity, ease: 'easeInOut'}}
                            className="relative z-10"
                        >
                            <div
                                className="w-2/4 aspect-square max-w-md mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1">
                                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
                                    <img
                                        src={profilePic}
                                        alt="Frontend Developer Workspace"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating shapes */}
                        <motion.div
                            animate={{y: [0, 14, 0], rotate: [0, 6, 0]}}
                            transition={{duration: 4, repeat: Infinity, ease: 'easeInOut'}}
                            className="pointer-events-none absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
                   w-24 h-24 rounded-2xl bg-blue-500/20 dark:bg-blue-500/10 backdrop-blur-sm"
                        />

                        <motion.div
                            animate={{y: [0, -14, 0], rotate: [0, -6, 0]}}
                            transition={{duration: 5, repeat: Infinity, ease: 'easeInOut'}}
                            className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-2xl bg-purple-500/20 dark:bg-purple-500/10 backdrop-blur-sm"
                        />
                    </motion.div>


                </div>

                {/* ================= Stats ================= */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
                >
                    {[
                        {label: 'Years of Practice', value: '4+', link: ""},
                        {label: 'Projects Built', value: '15+', link: ""},
                        {label: 'Technologies Used', value: '10+', link: ""},
                        {label: 'GitHub Repos', value: '20+', link: ""},
                    ].map((stat) => (<motion.div
                        key={stat.label}
                        whileHover={{scale: 1.05}}
                        className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
                    >
                        <Link to={stat?.link}>
                            <div className="text-3xl font-bold text-blue-500 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </Link>
                    </motion.div>))}
                </motion.div>
            </motion.div>


        </div>
    );
}
