import React, {useState} from 'react';
import {Typography, Card, Form, Input, Button, message} from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    GithubOutlined,
    LinkedinOutlined,
    SendOutlined,
} from '@ant-design/icons';
import {motion} from 'motion/react';

const {Title, Paragraph} = Typography;
const {TextArea} = Input;

export default function Contact() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success("Message sent successfully! I'll get back to you soon.");
            form.resetFields();
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <MailOutlined/>,
            label: 'Email',
            value: 'hamedabdollahzade.ab@gmail.com',
            href: 'mailto:hamedabdollahzade.ab@gmail.com',
        },
        {
            icon: <PhoneOutlined/>,
            label: 'Phone',
            value: '+98 910 790 2735',
            href: 'tel:+989107902735',
        },
        {
            icon: <EnvironmentOutlined/>,
            label: 'Location',
            value: 'Mashhad, Iran',
            href: null,
        },
    ];

    const socialLinks = [
        {
            icon: <GithubOutlined/>,
            label: 'GitHub',
            href: 'https://github.com/hamedAbdollahzade',
            color: 'hover:text-gray-900 dark:hover:text-white',
        },
        {
            icon: <LinkedinOutlined/>,
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/hamed-abdollahzade/',
            color: 'hover:text-blue-600',
        },
    ];

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
                        Get In Touch
                    </Title>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-6"/>
                    <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Interested in working together or have a question? Feel free to contact me anytime.
                    </Paragraph>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6}}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full">
                            <Title level={3} className="!mb-6 dark:!text-white">
                                Contact Information
                            </Title>

                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: index * 0.1}}
                                        className="flex items-start gap-4"
                                    >
                                        <div
                                            className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500 text-xl">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <Paragraph className="!mb-1 text-gray-500 dark:text-gray-400 text-sm">
                                                {item.label}
                                            </Paragraph>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-gray-900 dark:text-white hover:text-blue-500 transition-colors"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <Paragraph className="!mb-0 text-gray-900 dark:text-white">
                                                    {item.value}
                                                </Paragraph>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Social */}
                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <Title level={4} className="!mb-4 dark:!text-white">
                                    Follow Me
                                </Title>
                                <div className="flex gap-4">
                                    {socialLinks.map((link, index) => (
                                        <motion.a
                                            key={index}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.95}}
                                            className={`w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 text-xl transition-colors ${link.color}`}
                                            aria-label={link.label}
                                        >
                                            {link.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div
                                className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                                    <span className="text-green-700 dark:text-green-400 font-medium">
                    Open to opportunities
                  </span>
                                </div>
                                <Paragraph className="!mb-0 text-gray-600 dark:text-gray-400 text-sm">
                                    Available for frontend roles, freelance projects, and collaborations.
                                </Paragraph>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6}}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <Title level={3} className="!mb-6 dark:!text-white">
                                Send Me a Message
                            </Title>

                            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Form.Item
                                        name="name"
                                        label="Your Name"
                                        rules={[{required: true, message: 'Please enter your name'}]}
                                    >
                                        <Input size="large" placeholder="Your name"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="Your Email"
                                        rules={[
                                            {required: true, message: 'Please enter your email'},
                                            {type: 'email', message: 'Invalid email address'},
                                        ]}
                                    >
                                        <Input size="large" placeholder="you@example.com"/>
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="subject"
                                    label="Subject"
                                    rules={[{required: true, message: 'Please enter a subject'}]}
                                >
                                    <Input size="large" placeholder="Job opportunity / Collaboration"/>
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    label="Message"
                                    rules={[{required: true, message: 'Please enter your message'}]}
                                >
                                    <TextArea rows={6} placeholder="Write your message here..."/>
                                </Form.Item>

                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SendOutlined/>}
                                >
                                    Send Message
                                </Button>
                            </Form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
