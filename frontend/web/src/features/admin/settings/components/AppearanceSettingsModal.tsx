import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  CheckCircleIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface AppearanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

type Theme = 'light' | 'dark' | 'auto';
type Density = 'comfortable' | 'compact' | 'spacious';

const AppearanceSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: AppearanceSettingsModalProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [selectedDensity, setSelectedDensity] = useState<Density>('comfortable');
  const [accentColor, setAccentColor] = useState('#D4AF37'); // Gold

  const themes = [
    { id: 'light' as Theme, name: 'Light', icon: SunIcon, description: 'Clean and bright' },
    { id: 'dark' as Theme, name: 'Dark', icon: MoonIcon, description: 'Easy on the eyes' },
    { id: 'auto' as Theme, name: 'Auto', icon: ComputerDesktopIcon, description: 'Follows system' },
  ];

  const densities = [
    { id: 'comfortable' as Density, name: 'Comfortable', description: 'Balanced spacing' },
    { id: 'compact' as Density, name: 'Compact', description: 'More content visible' },
    { id: 'spacious' as Density, name: 'Spacious', description: 'Maximum breathing room' },
  ];

  const accentColors = [
    { name: 'Gold', color: '#D4AF37' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Green', color: '#10B981' },
    { name: 'Orange', color: '#F97316' },
  ];

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    onChangesMade();
    toast.success(`Theme changed to ${theme}`, {
      icon: theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻',
    });
  };

  const handleDensityChange = (density: Density) => {
    setSelectedDensity(density);
    onChangesMade();
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    onChangesMade();
  };

  const handleSave = () => {
    toast.success('Appearance settings saved!', {
      icon: '🎨',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    onChangesSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appearance & Theme"
      size="lg"
    >
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3">Theme</h4>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'border-gold bg-gold-pale shadow-lg'
                      : 'border-grey-200 hover:border-grey-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="w-5 h-5 text-gold" />
                    </div>
                  )}
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-gold' : 'text-grey-600'}`} />
                  <h5 className="text-sm font-semibold text-grey-900">{theme.name}</h5>
                  <p className="text-xs text-grey-500 mt-1">{theme.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3 flex items-center gap-2">
            <SwatchIcon className="w-5 h-5 text-gold" />
            Accent Color
          </h4>
          <div className="grid grid-cols-6 gap-3">
            {accentColors.map((colorOption) => {
              const isSelected = accentColor === colorOption.color;
              return (
                <button
                  key={colorOption.color}
                  onClick={() => handleAccentColorChange(colorOption.color)}
                  className={`relative group aspect-square rounded-xl transition-all duration-200 hover:scale-110 ${
                    isSelected ? 'ring-4 ring-offset-2 ring-offset-white' : ''
                  }`}
                  style={{
                    backgroundColor: colorOption.color,
                    boxShadow: isSelected ? `0 0 20px ${colorOption.color}50` : 'none',
                  }}
                  title={colorOption.name}
                >
                  {isSelected && (
                    <CheckCircleIcon className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Density */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3">Layout Density</h4>
          <div className="space-y-2">
            {densities.map((density) => {
              const isSelected = selectedDensity === density.id;
              return (
                <button
                  key={density.id}
                  onClick={() => handleDensityChange(density.id)}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all duration-200 hover:border-grey-300 ${
                    isSelected
                      ? 'border-gold bg-gold-pale'
                      : 'border-grey-200'
                  }`}
                >
                  <div className="text-left">
                    <h5 className="text-sm font-semibold text-grey-900">{density.name}</h5>
                    <p className="text-xs text-grey-500 mt-0.5">{density.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="w-5 h-5 text-gold" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3">Font Size</h4>
          <div className="flex items-center gap-4">
            <span className="text-sm text-grey-600">A</span>
            <input
              type="range"
              min="12"
              max="18"
              defaultValue="14"
              className="flex-1 h-2 bg-grey-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 50%, #E0E0E0 50%, #E0E0E0 100%)`
              }}
              onChange={(e) => {
                onChangesMade();
                toast(`Font size: ${e.target.value}px`, { icon: '📏' });
              }}
            />
            <span className="text-lg text-grey-600 font-bold">A</span>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-grey-50 border border-grey-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-grey-900 mb-2">Preview</h4>
          <div className="bg-white rounded-lg p-4 border border-grey-200">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <div>
                <div className="h-3 bg-grey-200 rounded w-24 mb-1.5" />
                <div className="h-2 bg-grey-100 rounded w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-grey-100 rounded w-full" />
              <div className="h-2 bg-grey-100 rounded w-5/6" />
              <div className="h-2 bg-grey-100 rounded w-4/6" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            onClick={handleSave}
            leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            className="flex-1"
          >
            Save Changes
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AppearanceSettingsModal;




