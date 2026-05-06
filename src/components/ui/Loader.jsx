export default function Loader() {
  return (
    <div className="mt-1.5 w-full h-[2px] bg-gray-100 rounded-full overflow-hidden relative">
      <div
        className="absolute inset-y-0 left-0 w-1/3 bg-[#7C3AED] rounded-full"
        style={{ animation: 'slide-progress 1.5s ease-in-out infinite' }}
      />
    </div>
  )
}
