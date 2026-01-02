import React from 'react';
import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';

const { Content } = AntLayout;

export default function Layout({ children, isDarkMode, toggleTheme }) {
  return (
    <AntLayout className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Content className="mt-16">
        {children}
      </Content>
      <Footer />
    </AntLayout>
  );
}
