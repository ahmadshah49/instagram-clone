
import Header from '../Header/page'
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import '@/app/globals.css'
import { useRef } from 'react';
const Feed = () => {
  const sliderRef = useRef(null);

  const handleWheelScroll = (e) => {
    const delta = e.deltaY;
    sliderRef.current.scrollLeft += delta;
  };

  const handleSlide = (drec) => {
    const slider = sliderRef.current;
    if (drec === "left") {
      slider.scrollLeft -= 400;
    }
    else {
      slider.scrollLeft += 400;
    }

  }
  return (
    <div>
      <Header />
      <div className='w-full max-w-screen-lg  mt-11 mx-auto grid grid-cols-3 gap-4'>
        <div className='col-span-2  bg-purple-300'>
          <section className='relative 'onWheel={handleWheelScroll} >

            <div className='absolute flex items-center justify-center top-10 left-3 text-black/80'>
              <FaArrowCircleLeft size={25} onClick={() => handleSlide('left')} />
            </div>
            <div className='absolute flex items-center justify-center top-10 right-3 text-black/80'>
              <FaArrowCircleRight size={25} onClick={() => handleSlide('right')} />
            </div>

            <div
            ref={sliderRef}
            className='carousel-body scroll-s flex  p-4 bg-white border  space-x-5 overflow-x-scroll'>
              {new Array(20).fill(0).map((_, index) => <div
                key={index}
                className='h-14 w-14 flex-none cursor-pointer bg-black/40 rounded-full ring ring-pink-600 ring-offset-2 '>

              </div>
              )}
            </div>

          </section>
          <section>this is posts Section</section>
        </div>
        <div className='col-span-1 bg-red-300'>This is SideBar</div>
      </div>
    </div>
  )
}

export default Feed


