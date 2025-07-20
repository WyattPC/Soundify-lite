// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiHeart,
    FiMusic,
    FiBarChart2,
  } from "react-icons/fi";
  
  export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
      navigate(path);
    };

    const isActive = (path) => {
      return location.pathname === path;
    };

    return (
      <aside className="w-36 h-screen bg-[#121212] text-gray-300 flex flex-col space-y-6 py-8 px-4">
        {/* Logo / Title */}
        <div className="text-white text-xl font-bold mb-4 tracking-wide text-center">
          SL
        </div>
  
        {/* Navigation */}
        <nav className="flex flex-col gap-6 text-sm items-center">
          <SidebarItem 
            icon={<FiHome size={32} />} 
            onClick={() => handleNavigation('/dashboard')}
            isActive={isActive('/dashboard')}
          />
          <SidebarItem 
            icon={<FiBarChart2 size={32} />} 
            onClick={() => handleNavigation('/statistics')}
            isActive={isActive('/statistics')}
          />
          <SidebarItem icon={<FiSearch size={32} />} />
          <SidebarItem icon={<FiMusic size={32} />} />
          <SidebarItem icon={<FiPlusSquare size={32} />} />
          <SidebarItem icon={<FiHeart size={32} />} />
        </nav>
      </aside>
    );
  }
  
  // Reusable subcomponent
  function SidebarItem({ icon, onClick, isActive = false }) {
    return (
      <div 
        className={`flex items-center justify-center cursor-pointer transition-all p-4 rounded-lg ${
          isActive 
            ? 'text-white bg-gray-800' 
            : 'hover:bg-gray-800'
        } sidebar-icon`}
        onClick={onClick}
      >
        <div>{icon}</div>
      </div>
    );
  }
  