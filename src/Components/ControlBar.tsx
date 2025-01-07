'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowUp } from "react-icons/fa";
import { motion, useAnimation } from 'framer-motion';
import { FaSearch } from "react-icons/fa";

interface ControlBarProps {
  func: React.MouseEventHandler<HTMLButtonElement>;
  changeFunc: (type: string) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ func, changeFunc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [SearchType, setType] = useState('articles');
  const [position , setPosition ] = useState('start');

  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      if (window.scrollY > 3200) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (isHidden) {
      controls.start({ y: '-80%', transition: { duration: 0.3 } });
    } else {
      controls.start({ y: '0%', transition: { duration: 0.3 } });
    }
  }, [isHidden, controls]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.div animate={controls} className='flex items-center justify-center w-full fixed h-[80px] max-md:top-2 z-50 left-0 top-0'>
        {menuOpen && <div onClick={toggleMenu} className='w-screen h-screen fixed left-0 -top-2 backdrop-blur-md'></div>}
        <div className="max-md:w-full max-md:h-[60px] max-md:m-2 p-3 items-center flex justify-between rounded-full w-[90%] bg-gray-900 bg-opacity-60 border-[1.2px] border-blue-400 backdrop-blur-xl">
          <h1 className='pl-4 text-2xl font-semibold'>SpaceFlightNews</h1>

          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              initial={{ rotate: 0 }}
              animate={{ rotate: menuOpen ? 180 : 0 }}
              className="text-blue-800 p-2 rounded-full focus:outline-none"
            >
              <FaChevronDown color='white' size={20} />
            </motion.button>
          </div>

          <div className='flex flex-col relative max-md:hidden'>
            <div className={`transition-all duration-100 max-md:hidden flex gap-20 font-semibold justify-evenly`}>
              <button onClick={() => { setType("articles") , setPosition('start'), changeFunc("articles") }}>Articles</button>
              <button onClick={() => { setType("blogs"),   setPosition('center') , changeFunc("blogs") }}>{'Blogs'}</button>
              <button onClick={() => { setType("reports") , setPosition('end') , changeFunc("reports") }}>Reports</button>
            </div>
            <div className={`h-1 w-full pl-[5px] pr-1 absolute top-7 flex justify-${position}`}>
              <div className='h-1 w-12 bg-blue-400 rounded-full'></div>
            </div>
          </div>
          <button className='max-md:hidden font-bold flex items-center gap-1 bg-gradient-to-b from-blue-500 to-blue-600 p-2 rounded-full' onClick={func}>Search <FaSearch /></button>

          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={menuOpen ? { y: 0, opacity: 1 } : { y: '-170%', opacity: 0 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            className="absolute z-0 rounded-2xl top-[80px] left-0 w-full bg-gray-900 bg-opacity-90 md:hidden flex flex-col gap-4 p-4 border-blue-400"
          >
            <button
              onClick={(e) => {
                func(e);
                toggleMenu();
              }}
              className='font-bold flex items-center gap-5 bg-gradient-to-b p-2 bg-gray-700 rounded-full w-full self-center'
            >
              <div className='flex justify-center items-center gap-1 bg-gradient-to-b from-blue-500 to-blue-400 font-semibold text-xs rounded-full p-2'>Search <FaSearch /></div>
              <p className='text-gray-500 text-xs'>type what you wanna search for</p>
            </button>

            <button
              onClick={() => {
                setType("articles");
                changeFunc("articles");
                toggleMenu();
              }}
              className={`p-2 font-bold rounded-3xl ${SearchType === "articles" ? " text-white bg-blue-400" : ""}`}
            >
              Articles
            </button>
            <button
              onClick={() => {
                setType("blogs");
                changeFunc("blogs");
                toggleMenu();
              }}
              className={`font-bold p-2 rounded-3xl ${SearchType === "blogs" ? " text-white bg-blue-400" : ""}`}
            >
              Blogs
            </button>
            <button
              onClick={() => {
                setType("reports");
                changeFunc("reports");
                toggleMenu();
              }}
              className={`font-bold p-2 rounded-3xl ${SearchType === "reports" ? " text-white bg-blue-400" : ""}`}
            >
              Reports
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          initial = {{left : '25px'}}
          animate = {{left : showTopButton ? '25px'  : '-50px'}}
          className="z-50 fixed  bottom-[25px] bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none">

          <FaArrowUp size={12} />
        </motion.button>
    </>
  );
};

export default ControlBar;
