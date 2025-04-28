export default function Breadcrumb({ items }) {
    return (
      <nav className="text-sm mb-2">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-600">/</span>}
              <a
                href="#"
                className={`hover:underline ${index === items.length - 1 ? "font-semibold text-white" : "text-gray-400"}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )
  }
  