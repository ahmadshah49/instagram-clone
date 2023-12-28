import { RiEmotionHappyLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { TbLocationShare } from "react-icons/tb";
import { VscBookmark } from "react-icons/vsc";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { auth, db } from "@/app/lib/db";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";

const Post = ({ id, username, caption, image, likeCount }) => {
    const [like, setLike] = useState(false)
    const handleLikePost = async () => {
        const postLike = {
            postId: id,
            userId: auth.currentUser.uid,
            username,
        }
        const likeRef = doc(db, `likes/${id}_${auth.currentUser.uid}`)
        const postRef = doc(db, `posts/${id}`)
        let updatedLikesCount;

        if (like) {

            await deleteDoc(likeRef);+
            if (likeCount) {
                updatedLikesCount = likeCount - 1
            } else {
                updatedLikesCount = 0
            }
            await updateDoc(postRef, {
                likeCount: updatedLikesCount,
            })
        } else {
            await setDoc(likeRef, postLike)
            if (likeCount) {
                updatedLikesCount = likeCount + 1
            } else {
                updatedLikesCount = 1
            }
            await updateDoc(postRef, {
                likeCount: updatedLikesCount ,
            })
        }
    };
    useEffect(() => {
        const likeRef = collection(db, 'likes')
        const likesquery = query(
            likeRef,
            where('postId', '==', id),
            where('userId', '==', auth.currentUser.uid)
        )
        const unsubcribeLikes = onSnapshot(likesquery, (snapshot) => {
            const like = snapshot.docs.map((doc) => doc.data());
            if (like.length !== 0) {
                setLike(true)
            } else {
                setLike(false)
            }
        })
        return () => {
            unsubcribeLikes()
        }
    }, [id])

    return (
        <>

            <div className='py-2 border mt-2'>
                <div className='px-2 flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-10 h-10 bg-black rounded-full border border-pink-600' />
                        <div>{username}</div>
                    </div>
                    <div className='pr-2'>
                        <HiOutlineDotsHorizontal size={20} />
                    </div>
                </div>
                <div className="my-2  relative aspect-square" >
                    <Image src={image} layout="fill" alt={caption}
                        className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center p-2">
                    <div className="flex items-center space-x-4">
                        <div onClick={handleLikePost}>
                            {like ? (

                                <AiFillHeart size={25} className="cursor-pointer  text-red-600" />
                            ) :
                                <AiOutlineHeart className="cursor-pointer" size={25} />

                            }

                        </div>
                        <div><FaRegComment size={25} /></div>
                        <div><TbLocationShare size={25} /></div>
                    </div>
                    <div><VscBookmark size={25} /></div>
                </div>
                <div className="p-2">{likeCount ? `${likeCount} likes` : 'be the first like'}</div>
                <div className="flex space-x-2 p-2">
                    <div className="font-semibold">{username}</div>
                    <div>{caption}</div>
                </div>
                <div>
                    <div>
                        {
                            new Array(3).fill(0).map((_, i) => (
                                <div key={i} className="flex space-x-2 p-2">
                                    <div className="font-semibold">username</div>
                                    <div key={i}>This is Comment {i + 1}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="p-2">3 Hours Ago</div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="p-2 flex items-center  border-t py-4 justify-between">
                        <div className="flex items-center space-x-2">
                            <div><RiEmotionHappyLine size={30} /></div>
                            <input type="text" name={`commment ${id}`} id={`commment ${id}`} placeholder="Add a Comment..." className="w-full outline-none" />
                        </div>
                        <div ><button type="submit" className="font-semibold text-blue-600">Post</button></div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Post