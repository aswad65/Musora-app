import { Play, Settings, SkipForward } from 'lucide-react'
import {React,useState} from 'react'



export const SidebarItem = ({ icon: Icon, label, active , handleSearch}) => {
  
  const [isActive, setIsActive] = useState(false)
  function handleClick() {
    setIsActive(true)
  }
  const handleBlur = () => {
    setIsActive(false);
  }
  
  return (
    <>
      <button onFocus={handleClick}  onBlur={handleBlur} onClick={handleSearch} className={`flex items-center w-full gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`}>
    <Icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-medium">{label}</span>
  </button>

{/* 2. BOTTOM SECTION */}
      

    
    </>
  )
}



