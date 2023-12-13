"use client"
import Lottie from 'react-lottie-player'
import authPage from '../public/assets/animations/authenticationPageAnimation.json'
import useForm from './hooks/useForm'
import { FaFacebookSquare } from "react-icons/fa";

export default function Home() {
  const { form, onChangeHandler } = useForm({
    email: '',
    password: ''
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();

  }
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='flex h-4/5 w-4/5'>
        <div className='w-full  '>
          <Lottie
            loop
            animationData={authPage}
            play
            className='w-full h-full'

          />
        </div>
        <div className='w-4/5  rounded-sm border text-center border-[#DBDBDB] px-10 '>
          <div className='mt-20 my-11 text-5xl font-bold '>Instagram</div>
          <form onSubmit={onSubmitHandler} className=' flex flex-col'>
            <input type="email" name='email' id='email' placeholder='Phone number,username,or email' onChange={onChangeHandler} value={form.email} className='py-3 bg-gray-100 my-2 px-2 outline-none border rounded-sm focus:border-[#aaaaaa]'/>

            <input type="password" name='password' id='password' placeholder='password' onChange={onChangeHandler} value={form.password}className='py-3 bg-gray-100 px-2 outline-none border mb-8 my-2 rounded-sm focus:border-[#aaaaaa]' />
            <button type='submit' className='bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold '>Log in</button>
          </form>
          <div className='flex items-center  my-8 justify-center'>
            <div className='h-[1px] w-full bg-[#DBDBDB]'/>
            <div className='mx-4 text-xs font-normal text-[#868585]'>OR</div>
            <div className='h-[1px] w-full bg-[#DBDBDB]'/>
          </div>
          <div className='mt-20 flex items-center justify-center'>
          <FaFacebookSquare className='text-[#385185]' size={20}/>
<div className='mx-4 text-[#385185] font-semibold text-sm'>Log in with Facebook</div>
          </div>
          <div className='my-10 text-xs text-[#385185]'>
            Forgot password?
          </div>
        </div>
      </div>
    </div>
  )
}
