import React from 'react';

function RedUser() {
  return (
    <div className='text-[#696771] h-full md:h-screen '>
      <div className='flex flex-col items-center justify-center  h-screen '>
        <svg xmlns="http://www.w3.org/2000/svg" width="183" height="183" viewBox="0 0 183 183" fill="none">
          <path d="M91.4716 0C41.0708 0 0 41.0708 0 91.4716C0 141.873 41.0708 182.943 91.4716 182.943C141.873 182.943 182.943 141.873 182.943 91.4716C182.943 41.0708 141.873 0 91.4716 0ZM135.195 70.4332L83.3307 122.298C82.0501 123.578 80.3121 124.31 78.4827 124.31C76.6532 124.31 74.9153 123.578 73.6347 122.298L47.7482 96.4111C45.0955 93.7584 45.0955 89.3678 47.7482 86.7151C50.4009 84.0624 54.7915 84.0624 57.4442 86.7151L78.4827 107.754L125.499 60.7372C128.152 58.0845 132.542 58.0845 135.195 60.7372C137.848 63.3899 137.848 67.689 135.195 70.4332Z" fill="#78C57F" />
        </svg>
        <h1 className='mt-4 sm:text-2xl'>Network status is Ok</h1>
      </div>
    </div>
  );
}

export { RedUser };