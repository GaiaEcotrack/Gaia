
function Footer() {
  return (
<footer
  className="flex flex-col items-center text-center text-white">
  <div className="container pt-9">
    <div className="mb-9 flex justify-center">
      <img src="/varaxgear.png" alt="" />
    </div>
  </div>

  <div
    className="w-full bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
    © 2023 Copyright:
    <a
      className="text-neutral-800 dark:text-neutral-400"
      href="https://tw-elements.com/"
      >Gaia Ecotrack</a
    >
  </div>
</footer>
  )
}

export {Footer}