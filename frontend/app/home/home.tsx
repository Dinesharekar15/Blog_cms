export default function Homepage() {
  return (
    <div className="flex bg-black min-h-screen ">
      <div className="w-1/8 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div className="rounded-lg text-center p-1.5 hover:bg-gray-600">
          Logo
        </div>
        <div>
          <nav className="mt-4 mx-4 hover:">
            <ul>
              <li className="mb-2 rounded-lg bg-gray-800 hover:bg-gray-600 underline-offset p-2">
                <a href="#" className="">
                  Home
                </a>
              </li>
              <li className="mb-2  rounded-lg bg-gray-800 hover:bg-gray-600 underline-offset p-2">
                <a href="#" className="">
                  Activity
                </a>
              </li>
              <li className="mb-2 rounded-lg bg-gray-800 hover:bg-gray-600 underline-offset p-2">
                <a href="#" className="">
                  Search
                </a>
              </li>
              <li className="mb-2 text-center bg-secondary rounded-4xl  hover:bg-hover underline-offset p-2">
                <button>Create</button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer mb-10">
          {/* Profile Photo/Icon */}
          <div className="flex items-center justify-center h-8 w-8 bg-red-500 rounded-full flex-shrink-0">
            <span className="text-xl font-bold">D</span>
          </div>

          {/* Name and Username */}
          <div className="flex flex-col flex-grow">
            <p className="text-[12px] font-semibold">Dinesh Arekar</p>
            <span className="text-[11px] text-gray-400">@arekardinesh</span>
          </div>

          {/* Ellipsis icon */}
          <div className="flex items-center justify-center text-gray-400">
            ...
          </div>
        </div>
      </div>
      <div className="w-4/4 p-8 bg-gray-100">main</div>
    </div>
  );
}
