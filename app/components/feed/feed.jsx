
import Header from '../Header/page'
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import '@/app/globals.css'
import { useContext, useEffect, useRef, useState } from 'react';
import Post from '../Post/post';
import Modal from '../Modal/Modal';
import GlobalContextProvider, { GlobalContext, GlobalContextDispatch } from '@/app/state/context/globalContextProvider';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/app/lib/db';
import {v4 as uuidv4} from 'uuid'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
const Feed = () => {
  const { setIsUploadPostOpen } = useContext(GlobalContext)
  const dispatch = useContext(GlobalContextDispatch)
  const closeModal = () => {
    dispatch({
      type: 'SET_IS_UPLOAD_POST_MODAL_OPEN',
      payload: {
        setIsUploadPostOpen: false,
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
  const [file, setFile] = useState('')
  const [media, setMedia] = useState({
    src: '',
    isUploading:false,
    caption:''
  })

  useEffect(() => {
    const reader = new FileReader()
    const handleEvent = (e) => {
      switch (e.type) {
        case 'load':
          return setMedia((prev) => ({
            ...prev,
            src: reader.result
          }))
          break;
        case 'error':
          return toast.error("Somthing went wronge")
        default:
          return
      }
    }
    if (file) {
      reader.addEventListener("load", handleEvent)
      reader.addEventListener("error", handleEvent)
      reader.readAsDataURL(file)
    }
    return () => {
      reader.removeEventListener("load", handleEvent)
      reader.removeEventListener("error", handleEvent)
    }
  }, [file])
const currentImage = useRef(null)
const handleRemovePost=()=>{
  setFile('')
  currentImage.current.src='';
}
const {user} = useContext(GlobalContext)

const handlePostMedia=async(url)=>{
const postId= uuidv4()
const postRef=doc(db,'posts',postId)
const post={
  id:postId,
  image:url,
  caption:media.caption,
  username:user.username ,
  createdAt:serverTimestamp()
}
try {
  await setDoc(postRef,post);
} catch (error) {

  toast.error('error posting the Image')
}
}
const handleUploadPost = async () => {
  if (!file) return toast.error("Please select a post");

  setMedia((prev) => ({ ...prev, isUploading: true }));
  const toastid = toast.loading("Uploading your Post, please wait...");
  const postName=`posts/${uuidv4()}-${file.name}`
  const storageRef = ref(storage, postName,);

  try {
    const uploadTask = await uploadBytes(storageRef, file);
    const url = await getDownloadURL (uploadTask.ref);
   await handlePostMedia(url)
    toast.success('Image uploaded', {
      id: toastid,
    });
  } catch (error) {
    toast.error('Failed to upload image', {
      id: toastid,
    });
   
  } finally {
    setMedia({
      src: '',
      isUploading: false,
     caption:''
    });
    setFile('');
    closeModal();
  }
};
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(false)
useEffect(() => {
  setLoading(true)
  const postCollection=collection(db,'posts')
const q =query(postCollection,orderBy('createdAt','desc'))
onSnapshot(q,(snapshot)=>{
  const posts=snapshot.docs.map((doc)=>doc.data())
  setPosts(posts)
setLoading(false)
})
}, [])
console.log(posts);

  return (
    <div>
      <Header />
      <Modal closeModal={closeModal} isOpen={setIsUploadPostOpen}>
        <div className='w-screen h-screen max-h-[70vh] max-w-3xl flex flex-col items-center  '>
          <div className='w-full py-4 text-center  text-xl border-b border-black/30 font-semibold'>Create new post</div>
          <div className='w-full h-full flex justify-center items-center'>
            {!file ?
              (
                <>
 
                  <label htmlFor="post" className='bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100'>Select From Computer</label>
                  <input
                    onChange={(e) => {
                      setFile(e.target.files[0])
                    }}
                    className='hidden'
                    type="file"
                    value={file.name}
                    name='post'
                    id='post'
                    multiple={false}
                    accept="image/jpeg,image/png"
                  /></>) : (
                <div className='flex flex-col gap-6 items-center justify-center'>
                  <input type='image' src={media.src} className='w-80 object-cover'ref={currentImage}
                  />
                  <input type="text" name='caption' 
                  id='caption' 
                  placeholder='Add caption' 
                  className='w-full border-2 border-black/40 rounded outline-none p-2 '
                  onChange={(e)=>setMedia((prev)=>({...prev,caption:e.target.value}))}
                  value={media.caption}
                  />
                  <div className='flex space-x-2'>
                    <button className='bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100' onClick={handleRemovePost}>Remove</button>
                    <button className='bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100' onClick={handleUploadPost}>upload</button>
                  </div>
                </div>

              )}
          </div>
        </div>
      </Modal>

      <div className='w-full max-w-screen-lg  mt-20 mx-auto grid grid-cols-3 gap-4'>
        <div className='col-span-2  '>
          <section className='relative ' onWheel={handleWheelScroll} >

            <div className='absolute flex items-center justify-center top-10 left-3 text-white/80'>
              <FaArrowCircleLeft size={25} onClick={() => handleSlide('left')} />
            </div>
            <div className='absolute flex items-center justify-center top-10 right-3 text-white/80'>
              <FaArrowCircleRight size={25} onClick={() => handleSlide('right')} />
            </div>

            <div
              ref={sliderRef}
              className='carousel-body scroll-smooth flex  p-4 bg-white border  space-x-5 overflow-x-scroll'>
              {new Array(20).fill(0).map((_, i) => <div
                key={i}
                className='h-14 w-14 flex-none cursor-pointer bg-black rounded-full ring ring-pink-600 ring-offset-2 '>

              </div>
              )}
            </div>

          </section>
          <section>
            {posts.map((post) => (
              <Post key={post.id} {...post} />
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


