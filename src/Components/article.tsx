"use client";

import React, { useState } from "react";
import Image from "next/image";
import notFound from '../../public/notFound.svg'
import {motion} from 'framer-motion'

interface ArticleProps {
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  url: string;
  newsSite: string;
}

const Article: React.FC<ArticleProps> = ({ title, summary, imageUrl, publishedAt, url, newsSite }) => {
  const [isImageError, setImageError] = useState(false);
  const [isImageLoading, setImageLoading] = useState(true);


  const publishedDate = new Date(publishedAt);
  const currentDate = new Date(); 
  const isToday = ( publishedDate.getDate() === currentDate.getDate() && publishedDate.getMonth() === currentDate.getMonth() && publishedDate.getFullYear() === currentDate.getFullYear() );

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity:1  }} viewport={{margin:'-100px'}} transition={{ duration: 1.6 }} 
      className="relative readMoreEffect float-left flex flex-col max-md:basis-[100%] lg:basis-[45%] xl:basis-[32%] sm:basis-[100%]  h-[400px] bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:scale-[98%] transition-transform">
    
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="readMore w-full h-[400px] bg-black bg-opacity-30 absolute z-30 backdrop-blur-[5px] flex items-center justify-center">
      <p className="text-2xl font-semibold">Read more</p>
    </a>


      {/* Image Section */}
      <div className="relative w-full h-60">
        {isImageLoading && !isImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="loader"></div>
          </div>
        )}

{!isImageError ? (
  <Image
    src={imageUrl}
    alt={title}
    layout="fill"
    objectFit="cover"
    className="rounded-ee-3xl"
    loading="lazy"
    onLoad={() => setImageLoading(false)}
    onError={() => {
      console.warn("Image failed to load:", imageUrl); // Log the error for debugging
      setImageError(true);
      setImageLoading(false);
    }}
  />
) : (
  <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white rounded-3xl">
    <Image 
      alt="Fallback image"
      src={'/notFound.svg'}
      width={90}
      height={90}
    />
  </div>
)}

    
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{summary}</p>

        <div className="flex gap-2">
           {isToday ?
              <p className="mt-auto flex justify-between items-center text-[12px] font-semibold text-green-600 bg-gray-800 w-fit pl-[6px] p-[1px] border-[1px] border-green-600 pr-[6px] rounded-full">
               Today
              </p>:
              <p className="mt-auto flex justify-between items-center text-[12px] font-semibold text-gray-500 bg-gray-800 w-fit pl-[6px] p-[1px] pr-[6px] rounded-full">
                  {new Date(publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",}
                    )}
              </p>
        }

        <p className="mt-auto flex justify-between items-center text-[12px] font-semibold text-gray-500 bg-gray-800 w-fit pl-[6px] p-[1px] pr-[6px] rounded-full">
          {newsSite}
        </p>
        
        </div>

      </div>
    </motion.div>
  );
};

export default Article;

<style jsx>{`
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
   
`}</style>
