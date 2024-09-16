import React from 'react'

const CreateWallet = () => {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <h2 className='text-black text-3xl'>How to create a wallet</h2>
 <video className="h-full w-full rounded-lg" controls>
    <source
      src="/Tutorial.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
  </div>
  )
}

export default CreateWallet