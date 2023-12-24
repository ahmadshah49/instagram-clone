
import Header from '../Header/page'
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import '@/app/globals.css'
import { useContext, useRef, useState } from 'react';
import Post from '../Post/post';
import Modal from '../Modal/Modal';
import { GlobalContext, GlobalContextDispatch } from '@/app/state/context/globalContextProvider';
const Feed = () => {
  const {setIsUploadPostOpen} = useContext(GlobalContext)
  const dispatch = useContext(GlobalContextDispatch)
const closeModal=()=>{
  dispatch({
    type:'SET_IS_UPLOAD_POST_MODAL_OPEN',
    payload:{
      setIsUploadPostOpen:false,
    }
  });

}

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
      <Modal closeModal={closeModal} isOpen={setIsUploadPostOpen}>
        <div>
          This is Modal Component
        </div>
      </Modal>

      <div className='w-full max-w-screen-lg  mt-20 mx-auto grid grid-cols-3 gap-4'>
        <div className='col-span-2  '>
          <section className='relative 'onWheel={handleWheelScroll} >

            <div className='absolute flex items-center justify-center top-10 left-3 text-black/80'>
              <FaArrowCircleLeft size={25} onClick={() => handleSlide('left')} />
            </div>
            <div className='absolute flex items-center justify-center top-10 right-3 text-black/80'>
              <FaArrowCircleRight size={25} onClick={() => handleSlide('right')} />
            </div>

            <div
            ref={sliderRef}
            className='carousel-body scroll-smooth flex  p-4 bg-white border  space-x-5 overflow-x-scroll'>
              {new Array(20).fill(0).map((_, i) => <div
                key={i}
                className='h-14 w-14 flex-none cursor-pointer bg-black/40 rounded-full ring ring-pink-600 ring-offset-2 '>

              </div>
              )}
            </div>

          </section>
          <section>
       {new Array(5).fill(1).map((_,i)=>(
            <Post key={i} postIndex="index"/>
       ))}
          </section>
        </div>
        <section className='col-span-1 bg-red-300 fixed right-[4%] max-w-sm'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia vero quos voluptatem nobis sequi quae excepturi. Aperiam amet dolor odio, dolores nobis doloribus neque omnis iste reprehenderit ducimus libero repellendus necessitatibus quasi dolore ratione pariatur illo obcaecati! Hic mollitia voluptatum quos iusto et minus quia voluptatibus voluptates labore atque ipsa rem debitis provident sit delectus, ipsum corrupti voluptas assumenda dolorem harum facilis animi officia! Enim iure ipsum temporibus nihil, est consequatur, dolor vero maxime assumenda harum quos voluptates, commodi beatae corporis repellat quod. Excepturi quibusdam incidunt laboriosam facilis quasi, quae itaque, provident, odio maiores nostrum accusamus. Adipisci dolor recusandae inventore?
          </section>
      </div>
    </div>
  )
}

export default Feed


