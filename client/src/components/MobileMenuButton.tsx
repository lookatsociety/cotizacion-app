import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg w-12 h-12 flex items-center justify-center md:hidden"
      aria-label="Abrir menú"
    >
      <Menu size={24} />
    </button>
  );
};