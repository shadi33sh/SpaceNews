'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Article from './article';
import ControlBar from './ControlBar';
import Search from './Search';
import { FaChevronCircleDown } from "react-icons/fa";

// Customize NProgress behavior
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 500,
  trickleSpeed: 200,
});

export default function NewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setToggleSearch] = useState(false);
  const [SearchType, setType] = useState('articles');
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    setData([]); // Clear previous data
    setOffset(0); // Reset offset
    setError(null); // Reset error
    setIsLoading(false);
    getNews(); // Fetch new data
  }, [SearchType]); // Triggered when `SearchType` changes

  const toggleSearch = () => {
    setToggleSearch((prevState) => !prevState);
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
  };

  const changeType = (type: string) => {
    setOffset(0); // Reset offset
    setType(type); // Update the search type, triggering `useEffect`
  };

  const getNews = () => {
    NProgress.start();
    setIsLoading(true);
    setError(null); // Clear any previous error

    axios
      .get(`https://api.spaceflightnewsapi.net/v4/${SearchType}/`, {
        params: {
          format: 'json',
          limit: 9,
          offset: offset,
        },
      })
      .then((response) => {
        setOffset((prev) => prev + 9); // Update the offset for the next fetch
        setData((prev) => [...prev, ...response.data.results]); // Append new data
      })
      .catch((error) => {
          setError('Failed to fetch data. Please check your network connection refresh the page.');
      })
      .finally(() => {
        setIsLoading(false);
        NProgress.done();
      });
  };

  return (
    <div className="w-full">
      <ControlBar func={toggleSearch} changeFunc={changeType} />
      {search && <Search func={toggleSearch} />}
      <div className="mt-12 flex flex-wrap w-full gap-6 justify-center">
        {error ? (
        <div className='w-11/12 text-center font-bold h-[80vh] flex flex-col items-cneter justify-center text-red-600'>
          {error}  
       </div>
        ) : (
          data.map((element, index) => (
            <Article
              key={index}
              title={element.title}
              publishedAt={element.published_at}
              summary={element.summary}
              url={element.url}
              imageUrl={element.image_url}
              newsSite={element.news_site}
            />
          ))
        )}
      </div>

      
      {data.length !== 0 && !error && (
        <div className="flex items-center justify-center h-24 w-full">
          {!isLoading ? (
            <button onClick={getNews} className="font-bold p-4 flex items-center gap-2">
              more <FaChevronCircleDown />
            </button>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      )}
    </div>
  );
}
