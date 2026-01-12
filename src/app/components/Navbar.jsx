import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Button, Drawer} from 'antd';
import {
    MenuOutlined, SunOutlined, MoonOutlined,
} from '@ant-design/icons';
import {motion} from 'motion/react';

/* =======================
   Navigation Config
======================= */
const NAV_LINKS = [{path: '/', label: 'Home'}, {path: '/about', label: 'About'}, {
    path: '/projects',
    label: 'Projects'
}, {path: '/experience', label: 'Experience'}, {path: '/contact', label: 'Contact'},];

export default function Navbar({isDarkMode, toggleTheme}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({to, label, mobile = false}) => (<Link
        to={to}
        onClick={() => mobile && setDrawerOpen(false)}
        className={`
        ${mobile ? 'block py-2 text-lg' : 'px-3 py-2'}
        relative font-medium transition-colors duration-200
        ${isActive(to) ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'}
      `}
    >
        {label}

        {/* Active underline (desktop only) */}
        {isActive(to) && !mobile && (<motion.span
            layoutId="active-nav"
            className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500 rounded-full"
            transition={{type: 'spring', stiffness: 380, damping: 30}}
        />)}
    </Link>);

    return (<motion.nav
        initial={{y: -80}}
        animate={{y: 0}}
        transition={{duration: 0.4, ease: 'easeOut'}}
        className="w-screen fixed  top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
    >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* ================= Logo ================= */}
                <Link to="/" className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">HA</span>
                    </div>
                    {/*<span className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-white">*/}
                    {/*          Hamed Abdollahzade*/}
                    {/*    </span>*/}
                </Link>

                {/* ================= Desktop Menu ================= */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (<NavItem
                        key={link.path}
                        to={link.path}
                        label={link.label}
                    />))}
                </div>

                {/* ================= Actions ================= */}
                <div className="flex items-center gap-2">
                    <Button
                        type="text"
                        aria-label="Toggle theme"
                        icon={isDarkMode ? <SunOutlined/> : <MoonOutlined/>}
                        onClick={toggleTheme}
                        className="text-gray-700 dark:text-gray-300 !text-2xl"
                    />

                    <Button
                        type="text"
                        aria-label="Open menu"
                        icon={<MenuOutlined/>}
                        onClick={() => setDrawerOpen(true)}
                        className="md:hidden text-gray-700 dark:text-gray-300 !text-2xl"
                    />
                </div>
            </div>
        </div>

        {/* ================= Mobile Drawer ================= */}
        <Drawer
            title="Menu"
            placement="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            className="dark:bg-gray-900"
            contentWrapperStyle={{boxShadow: "none", width: "60%"}}
        >
            <div className="flex flex-col  gap-4 ">
                {NAV_LINKS.map((link) => (<NavItem
                    key={link.path}
                    to={link.path}
                    label={link.label}
                    mobile
                />))}
            </div>
        </Drawer>
    </motion.nav>);
}
