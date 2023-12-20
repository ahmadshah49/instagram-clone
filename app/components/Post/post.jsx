import { RiEmotionHappyLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { TbLocationShare } from "react-icons/tb";
import { VscBookmark } from "react-icons/vsc";

const Post = ({postIndex}) => {
    return (
        <div className='py-2 border mt-2'>
            <div className='px-2 flex justify-between items-center'>
                <div className='flex items-center space-x-2'>
                    <div className='w-10 h-10 bg-white rounded-full border border-pink-600' />
                    <div>UserName</div>
                </div>
                <div className='pr-2'>
                    <HiOutlineDotsHorizontal size={20} />
                </div>
            </div>
            <div className="my-2 bg-black aspect-square" />
            <div className="flex justify-between p-2">
                <div className="flex items-center space-x-4">
                    <div><FaRegHeart size={20}/></div>
                    <div><FaRegComment size={20}/></div>
                    <div><TbLocationShare size={20}/></div>
                </div>
                <div><VscBookmark size={25}/></div>
            </div>
            <div className="p-2">1000Likes</div>
            <div className="flex space-x-2 p-2">
                <div className="font-semibold">username</div>
                <div>This is Caption</div>
            </div>
            <div>
               <div>
                 {
                     new Array(3).fill(0).map((_,i)=>(
                         <div key={i} className="flex space-x-2 p-2">
                            <div className="font-semibold">username</div>
                            <div key={i}>This is Comment {i + 1}</div>
                        </div>
                    ))
                }
               </div>
            </div>
            <div className="p-2">3 Hours Ago</div>
          <form onSubmit={(e)=>e.preventDefault()}>
          <div className="p-2 flex items-center border border-t py-4 justify-between">
                <div className="flex items-center space-x-2">
                    <div><RiEmotionHappyLine size={30} /></div>
                    <input type="text" name={`commment ${postIndex}`} id={`commment ${postIndex}`} placeholder="Add a Comment..." className="w-full outline-none" />
                </div>
                <div ><button type="submit" className="font-semibold text-blue-600">Post</button></div>
            </div>
          </form>
            
        </div>
    )
}

export default Post