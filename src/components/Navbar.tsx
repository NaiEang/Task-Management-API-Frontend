import { LogOut} from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-50 text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition-all duration-200 border border-gray-200 text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}