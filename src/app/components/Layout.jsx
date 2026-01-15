import React, {useEffect} from 'react';
import {Layout as AntLayout} from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';
import {handleScrollTop} from "@/app/util/helper.js";
import {useLocation} from "react-router-dom";

const {Content} = AntLayout;

export default function Layout({children, isDarkMode, toggleTheme}) {

    const {pathname} = useLocation()

    useEffect(() => {
        handleScrollTop()
    }, [pathname])


    return (
        <AntLayout className="min-h-screen   bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>
            <Content className="mt-16">
                {children}
            </Content>
            <Footer/>
        </AntLayout>
    );
}
