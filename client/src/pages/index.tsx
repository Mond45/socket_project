export default function Page() {
  // create button decorators class

  const hoverEffect = "hover:scale-105 hover:shadow-lg hover:bg-[#4681f4] transition-transform duration-300 ease-in-out";
  const buttonDecorators = "text-4xl font-bold text-white bg-[#55c2da] px-4 py-2 rounded-md w-[200px] flex justify-center items-center" + " " + hoverEffect;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8">
      <a href="/login" className={buttonDecorators}>
        Login
      </a>
      <a href="/register" className={buttonDecorators}>
        Register
      </a>
    </div>
  );
}
