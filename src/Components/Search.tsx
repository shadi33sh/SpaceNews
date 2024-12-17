'use client'
import React, { useState } from 'react'
import Article from './article'
import axios from 'axios'
import { IoExit } from "react-icons/io5"
import { FaSearch } from "react-icons/fa"
import { FaChevronCircleDown } from "react-icons/fa"
import { BiSolidErrorCircle } from "react-icons/bi"
import { motion } from 'framer-motion'

interface SearchProps { func: React.MouseEventHandler<HTMLElement> }

const Search: React.FC<SearchProps> = ({ func }) => {
  const [searched, setSearched] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [IsLoadingMore, setIsLoadingMore] = useState(false)
  const [offset, setOffset] = useState(9)
  const [data, setData] = useState<any[]>([])
  const [SearchType, setType] = useState('articles')
  const [srch, setSrch] = useState('')
  const [count, setCount] = useState("")

  const getNews = async () => {
    setSearched(true)
    setIsLoading(true)
    try {
      await axios.get(`https://api.spaceflightnewsapi.net/v4/${SearchType}`, {
        params: {
          search: srch,
          limit: 9,
          offset: 0,
        }
      }).then(response => {
        setIsLoading(false)
        setData(response.data.results)
        response.data.next == null ? setHasNext(false) : setHasNext(true)
        setCount(response.data.count)
        console.log(response)
      })
        .catch(e => console.log(e))
        .finally(() => {
          setIsLoading(false)
        });
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const loadMore = async () => {
    setOffset(perv => perv + 9)
    setIsLoadingMore(true)
    try {
      await axios.get(`https://api.spaceflightnewsapi.net/v4/${SearchType}`, {
        params: {
          search: srch,
          limit: 9,
          offset: offset,
        }
      }).then(response => {
        setIsLoadingMore(false)
        setData(perv => [...perv, ...response.data.results])
        response.data.next == null ? setHasNext(false) : setHasNext(true)
        console.log(response)
      })
        .catch(e => console.log(e))
        .finally(() => {
          setIsLoadingMore(false)
        });
    } catch (error) {
      setIsLoadingMore(false)
      console.log(error)
    }
  }

  return (
    <div className='fixed w-screen h-screen backdrop-blur-lg z-50 top-0 left-0 '>
      <div className='fixed w-screen h-screen backdrop-blur-lg z-20 top-0 left-0' onClick={func}></div>
      <motion.div
        initial={{ x: '100%' }} // Start from off-screen (right side)
        animate={{ x: '0%' }} // Slide to the center
        exit={{ x: '100%' }} // Slide out to the right on exit
        transition={{ type: 'spring', stiffness: 150 }} // Add spring animation
        className='p-7 absolute w-[93%] h-[90vh] bg-gray-800 border-2 border-white border-opacity-10 rounded-2xl top-[5vh] left-[3%] z-50 overflow-y-scroll'
      >
        <div className='flex justify-between gap-3 h-auto '>
          <button onClick={func} type="submit" >
            <IoExit size={23} />
          </button>

          <form onSubmit={(e) => { e.preventDefault(); getNews() }} className="max-w-lg mx-auto w-full">
            <div className="flex">
              <select onChange={e => { setType(e.target.value); setData([]); setOffset(9); setSearched(false) }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold h-10 rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="articles">articles</option>
                <option value="blogs">blogs</option>
                <option value="reports">reports</option>
              </select>

              <div className="relative w-full">
                <input onChange={e => setSrch(e.target.value)} type="search" id="search-dropdown" className="block p-2.5  h-10 w-full focus:outline-none z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300  focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder={`Search ${SearchType}`} required />
                <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800  focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <FaSearch />
                </button>
              </div>
            </div>
          </form>
        </div>
        {data.length != 0 && <p className='p-3 pt-6 font-bold'>{count} results</p>}
        {!isLoading ?
          !(data.length == 0 && searched) ?
            <div className="flex flex-wrap gap-6 justify-center  max-md:mt-5">
              {data.map((element, index) => (
                <Article
                  key={index}
                  title={element.title}
                  publishedAt={element.published_at}
                  summary={element.summary}
                  url={element.url}
                  imageUrl={element.image_url}
                  newsSite={element.news_site}
                />
              ))}
            </div>

            : <div className='relative top-1/2 flex items-center justify-center'>
              <p className='flex items-center gap-1 font-semibold'>no search results <BiSolidErrorCircle size={18} /></p>
            </div>
          :
          <div className='relative top-1/2 flex items-center justify-center'>
            <div className="loader"></div>
          </div>
        }

        {(data.length != 0 && hasNext) &&
          <div className="flex justify-center items-center h-20">
            {!IsLoadingMore ?
              <button className='font-bold p-4 flex items-center gap-2' onClick={loadMore}>more <FaChevronCircleDown /></button>
              : <div className='loader'></div>}
          </div>
        }

      </motion.div>
    </div>
  )
}

export default Search
