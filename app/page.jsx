import Image from 'next/image'

export default function Home() {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
<div className='w-4/5 h-4/5 bg-slate-700'>This is Left</div>
<div className='w-4/5 h-4/5 bg-violet-300'>This is Right</div>
    </div>
  )
}
