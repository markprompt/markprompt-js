export const Pattern = () => (
  <div className="opacity-70 absolute left-1/2 top-0 ml-[-15rem] h-[30rem] w-[80rem] dark:[mask-image:linear-gradient(white,transparent)]">
    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-highlight-200 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary-500/50 dark:to-highlight-200/20 dark:opacity-100">
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 inset-y-[-20%] h-[200%] w-full skew-y-[15deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
      >
        <defs>
          <pattern
            id=":rc:"
            width="40"
            height="30"
            patternUnits="userSpaceOnUse"
            x="-12"
            y="4"
          >
            <path d="M.5 56V.5H72" fill="none"></path>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#:rc:)"
        ></rect>
      </svg>
    </div>
    <svg
      viewBox="0 0 1113 440"
      aria-hidden="true"
      className="absolute top-20 left-1/2 ml-[-22rem] w-[50rem] fill-white blur-[30px] opacity-70 dark:hidden"
    >
      <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z"></path>
    </svg>
  </div>
)
