import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ConfigProvider, theme} from 'antd';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import {ArrowUpFromDot} from "lucide-react";
import {handleScrollTop} from "@/app/util/helper.js";


export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);


    useEffect(() => {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
        localStorage.setItem('i18nextLng', "fa");

    }, []);


    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#3b82f6',
                    borderRadius: 8,
                },
            }}
        >
            <div className={"fixed z-[99] cursor-pointer p-3 rounded-full bg-purple-600 opacity-80  bottom-5 left-5 "}>
                <ArrowUpFromDot size={25} onClick={handleScrollTop}/>
            </div>

            <Router>
                <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/projects" element={<Projects/>}/>
                        <Route path="/experience" element={<Experience/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                    </Routes>
                </Layout>
            </Router>
        </ConfigProvider>
    );
}
