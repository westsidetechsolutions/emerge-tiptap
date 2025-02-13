'use client';

import { useState, useEffect } from 'react';
import { X, FolderPlus, Upload, ChevronLeft } from 'lucide-react';

type Folder = {
  name: string;
  folders: Folder[];
  images: string[]; // Base64 strings
};

type AssetManagerProps = {
  onClose: () => void;
  onSelectImage: (src: string) => void;
};

const initialTree: Folder = {
  name: 'root',
  folders: [],
  images: [],
};

export default function AssetManager({ onClose, onSelectImage }: AssetManagerProps) {
  const [structure, setStructure] = useState<Folder>(initialTree);
  const [currentPath, setCurrentPath] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState<string>('');

  // Load structure from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('assetManager');
    if (stored) {
      const parsed = JSON.parse(stored);
      setStructure(parsed);
    }
  }, []);

  // Save structure to localStorage whenever it changes
  useEffect(() => {
    if (structure !== initialTree) {
      localStorage.setItem('assetManager', JSON.stringify(structure));
    }
  }, [structure]);

  const getCurrentFolder = (): Folder => {
    if (currentPath.length === 0) return structure;
    return currentPath.reduce((acc, folder) => {
      const found = acc.folders.find(f => f.name === folder.name);
      return found || acc;
    }, structure);
  };

  const updateStructure = (newStructure: Folder) => {
    setStructure(newStructure);
    localStorage.setItem('assetManager', JSON.stringify(newStructure));
  };

  const navigateTo = (folder: Folder) => {
    setCurrentPath([...currentPath, folder]);
  };

  const navigateUp = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const addFolder = () => {
    if (newFolderName.trim() === '') return;
    const newStructure = { ...structure };
    const current = getCurrentFolder();
    
    if (current.folders.find(f => f.name === newFolderName)) {
      alert('Folder already exists');
      return;
    }

    current.folders.push({ name: newFolderName, folders: [], images: [] });
    updateStructure(newStructure);
    setNewFolderName('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newStructure = { ...structure };
    const current = getCurrentFolder();

    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    };

    const imagePromises = Array.from(files).map(processFile);
    const images = await Promise.all(imagePromises);
    
    current.images.push(...images);
    updateStructure(newStructure);
  };

  const selectImage = (src: string) => {
    onSelectImage(src);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Asset Manager</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-2 p-4 border-b">
          <button
            onClick={navigateUp}
            disabled={currentPath.length === 0}
            className={`p-2 rounded-lg flex items-center gap-1 ${
              currentPath.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="px-3 py-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addFolder}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
            >
              <FolderPlus className="w-4 h-4" />
              Add Folder
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-b">
          <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer border-2 border-dashed border-gray-300">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">Upload Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Folders */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Folders</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getCurrentFolder().folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => navigateTo(folder)}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📁</span>
                    <span className="text-gray-700 group-hover:text-gray-900 truncate">
                      {folder.name}
                    </span>
                  </div>
                </button>
              ))}
              {getCurrentFolder().folders.length === 0 && (
                <p className="text-gray-500 col-span-full">No folders</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getCurrentFolder().images.map((src, index) => (
                <div
                  key={index}
                  className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => selectImage(src)}
                >
                  <img
                    src={src}
                    alt={`Asset ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Click to select</span>
                  </div>
                </div>
              ))}
              {getCurrentFolder().images.length === 0 && (
                <p className="text-gray-500 col-span-full">No images</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 