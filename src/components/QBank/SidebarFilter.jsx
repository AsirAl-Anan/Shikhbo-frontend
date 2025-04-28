export default function SidebarFilter() {
    const sizes = ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14"]
  
    return (
      <div className="space-y-8">
        <div>
          <h2 className="font-bold mb-4">Filter By:</h2>
        </div>
  
        <div>
          <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Sizes</h3>
          <p className="text-sm mb-4">
            Most of our shoes only come in full sizes. If you're a half size, select your nearest whole size too.
          </p>
  
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className="border border-gray-300 h-10 flex items-center justify-center hover:border-black transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Best For</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Everyday</span>
            </label>
          </div>
        </div>
      </div>
    )
  }
  