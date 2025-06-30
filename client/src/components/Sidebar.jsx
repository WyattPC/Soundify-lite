// src/components/Sidebar.jsx
import {
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiHeart,
    FiMusic,
  } from "react-icons/fi";
  
  export default function Sidebar() {
    return (
      <aside className="w-56 h-screen bg-[#121212] text-gray-300 flex flex-col space-y-6 py-8 px-4">
        {/* Logo / Title */}
        <div className="text-white text-2xl font-bold mb-4 tracking-wide">
          Soundify Lite
        </div>
  
        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-sm">
          <SidebarItem icon={<FiHome size={20} />} label="Home" />
          <SidebarItem icon={<FiSearch size={20} />} label="Search" />
          <SidebarItem icon={<FiMusic size={20} />} label="Library" />
          <SidebarItem icon={<FiPlusSquare size={20} />} label="Add Music" />
          <SidebarItem icon={<FiHeart size={20} />} label="Liked Songs" />
        </nav>
      </aside>
    );
  }
  
  // Reusable subcomponent
  function SidebarItem({ icon, label }) {
    return (
      <div className="flex items-center gap-4 cursor-pointer hover:text-white transition-all">
        <div>{icon}</div>
        <span>{label}</span>
      </div>
    );
  }
  