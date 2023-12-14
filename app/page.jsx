"use client"
import Lottie from 'react-lottie-player'
import authPage from '../public/assets/animations/authenticationPageAnimation.json'
import useForm from './hooks/useForm'
import { FaFacebookSquare } from "react-icons/fa";
import { useMemo } from 'react';
import Image from 'next/image';
export default function Home() {
  const { form, onChangeHandler } = useForm({
    email: '',
    password: ''
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();

  }
  const isDisabled = useMemo(() => {
    return !Object.values(form).every((val) => !!val);
  }, [form]);
    
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
        <div className='w-3/5 flex flex-col justify-center rounded-sm space-y-4 text-center   '>
          
        <div className=' rounded-sm border text-center border-[#DBDBDB] px-10 '>
        <form onSubmit={onSubmitHandler} className=' flex flex-col'>
          <div className='mt-10 my-6 text-4xl font-bold '>Instagram</div>
            <input type="email" name='email' id='email' placeholder='Phone number,username,or email' onChange={onChangeHandler} value={form.email} className='py-3 bg-gray-100 my-2 px-2 outline-none border rounded-sm focus:border-[#aaaaaa]'/>

            <input type="password" name='password' id='password' placeholder='password' onChange={onChangeHandler} value={form.password}className='py-3 bg-gray-100 px-2 outline-none border mb-8 my-2 rounded-sm focus:border-[#aaaaaa]' />
            <button type='submit' className='bg-[#57bcfe] hover:bg-[#0095F6] text-white py-2 px-8 rounded-md font-semibold active:scale-95 transform transition disabled:bg-[#99d6ff] disabled:scale-100'disabled={isDisabled}>Log in</button>
          </form>
          <div className='flex items-center  my-8 justify-center'>
            <div className='h-[1px] w-full bg-[#DBDBDB]'/>
            <div className='mx-4 text-xs font-normal text-[#868585]'>OR</div>
            <div className='h-[1px] w-full bg-[#DBDBDB]'/>
          </div>
          <div className='mt-14 flex items-center justify-center'>
          <FaFacebookSquare className='text-[#385185]' size={20}/>
<div className='mx-4 text-[#385185] font-semibold text-sm'>Log in with Facebook</div>
          </div>
          <div className='my-4 text-xs text-[#385185]'>
            Forgot password?
          </div>
        </div>
         <div className='py-4 rounded-sm border text-center border-[#DBDBDB] px-10 '>
         Don&apos;t have an account? <span className='text-[#0095F6] cursor-pointer font-semibold text-sm'>Sign up</span>
         </div>
         <div className='flex flex-col items-center justify-center'>
          <h1 className='text-sm'>Get the app.</h1>
          <div className='flex gap-4 py-2'>
             <Image
             src={"data:image/png;base64,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"}
             width={100}
             height={100}
             />
             <Image
             src={"data:image/png;base64,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"}
             width={100}
             height={100}
             />
          </div>
         </div>
        </div>
        
      </div>
    </div>
  )
}
