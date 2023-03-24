export const Blurs = () => (
  <div className="pointer-events-none absolute left-[-300px] right-[-300px] top-[-200px] bottom-[-200px] z-0 hidden opacity-20 sm:block">
    <div className="animate-pulse-slow absolute left-[200px] top-[100px] z-10 h-[300px] w-[500px] rotate-[20deg] transform rounded-full bg-sky-500 blur-[200px]" />
    <div className="absolute right-[100px] top-[200px] z-10 h-[150px] w-[400px] rotate-[80deg] transform rounded-full bg-fuchsia-500 blur-[150px]" />
    <div className="absolute left-[150px] bottom-[200px] z-10 h-[200px] w-[500px] rotate-[30deg] transform rounded-full bg-violet-500 blur-[200px]" />
  </div>
);
