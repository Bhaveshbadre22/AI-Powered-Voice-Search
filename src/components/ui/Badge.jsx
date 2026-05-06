export default function Badge({ children }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest text-gray-400 bg-gray-50">
      {children}
    </span>
  )
}
