'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ZoomIn,
  ZoomOut,
  Flag,
  Zap,
  Coffee,
  Home,
  Crosshair,
  Lock,
  Unlock,
  Save,
  Upload,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Map as MapIcon,
  Trophy,
  Car
} from 'lucide-react';

// ============================================================================
// DATA: Categories & Map Markers
// ============================================================================

const categories = {
  LOCATIONS: { id: 'locations', label: 'Locations', jp: '場所', icon: MapIcon },
  EVENTS: { id: 'events', label: 'Events', jp: 'イベント', icon: Flag },
  PR_STUNTS: { id: 'pr_stunts', label: 'PR Stunts', jp: 'PRスタント', icon: Zap },
  COLLECTIBLES: { id: 'collectibles', label: 'Collectibles', jp: '収集品', icon: Trophy },
};

const markerTypes = {
  // Locations
  FESTIVAL: { id: 'festival', category: 'LOCATIONS', label: 'Festival Site', icon: Home, color: 'bg-red-600' },
  HOUSE: { id: 'house', category: 'LOCATIONS', label: 'Player House', icon: Home, color: 'bg-purple-600' },
  // Events
  SPRINT: { id: 'sprint', category: 'EVENTS', label: 'Sprint Race', icon: Flag, color: 'bg-blue-600' },
  CIRCUIT: { id: 'circuit', category: 'EVENTS', label: 'Circuit Race', icon: Flag, color: 'bg-blue-500' },
  TOUGE: { id: 'touge', category: 'EVENTS', label: 'Touge Battle', icon: Car, color: 'bg-emerald-500' },
  // PR Stunts
  SPEED_TRAP: { id: 'speed_trap', category: 'PR_STUNTS', label: 'Speed Trap', icon: Zap, color: 'bg-yellow-500' },
  DRIFT_ZONE: { id: 'drift_zone', category: 'PR_STUNTS', label: 'Drift Zone', icon: Zap, color: 'bg-orange-500' },
  // Collectibles
  BARN_FIND: { id: 'barn_find', category: 'COLLECTIBLES', label: 'Barn Find', icon: Coffee, color: 'bg-purple-800' },
  XP_BOARD: { id: 'xp_board', category: 'COLLECTIBLES', label: 'XP Board', icon: Zap, color: 'bg-pink-500' },
};

const initialMockMarkers = [
  { id: 1, type: 'FESTIVAL', title: 'Horizon Japan Main Stage', x: 45, y: 55 },
  { id: 7, type: 'FESTIVAL', title: 'Horizon Apex Outpost', x: 75, y: 70 },
  { id: 8, type: 'HOUSE', title: 'Tokyo Penthouse', x: 65, y: 40 },
  { id: 2, type: 'SPRINT', title: 'Neon Nights Sprint', x: 60, y: 40 },
  { id: 9, type: 'CIRCUIT', title: 'Suzuka Proxy Circuit', x: 85, y: 80 },
  { id: 3, type: 'TOUGE', title: 'Mt. Fuji Downhill', x: 30, y: 20 },
  { id: 10, type: 'TOUGE', title: 'Akina Pass', x: 28, y: 15 },
  { id: 4, type: 'SPEED_TRAP', title: 'Shibuya Speed Trap', x: 65, y: 45 },
  { id: 5, type: 'DRIFT_ZONE', title: 'Sakura Touge Drift', x: 25, y: 25 },
  { id: 6, type: 'BARN_FIND', title: 'Hidden Classic (Toyota 2000GT)', x: 80, y: 15 },
  { id: 11, type: 'XP_BOARD', title: '5000 XP Board', x: 40, y: 30 },
  { id: 12, type: 'XP_BOARD', title: '1000 XP Board', x: 42, y: 32 },
];

const MAP_IMAGE_URL = "https://cdn.mapgenie.io/images/games/forza-horizon-5/preview.jpg";


// ============================================================================
// BLOCK 1: NavigationBar Component
// ============================================================================

const NavigationBar = ({ isDarkMode, toggleDarkMode, toggleSidebar, isSidebarOpen }) => {
  return (
    <nav className="h-16 w-full z-[100] bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors duration-300 flex-shrink-0">
      <div className="w-full h-full px-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <Menu className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center transform -skew-x-12">
              <span className="text-white font-bold italic tracking-tighter">FH</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-xl tracking-wider uppercase leading-none text-neutral-900 dark:text-white transition-colors">
                Horizon<span className="text-red-500">Wiki</span>
              </span>
              <span className="text-[9px] text-red-500 tracking-[0.3em] mt-1 font-medium">インタラクティブマップ</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex space-x-8">
          {['Overview', 'Vehicles', 'Map', 'Features', 'Updates'].map((item) => (
            <a key={item} href={`#`} className={`text-sm font-medium transition-colors duration-200 uppercase tracking-wide ${item === 'Map' ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600 pb-1' : 'text-neutral-600 hover:text-red-600 dark:text-neutral-300 dark:hover:text-white'}`}>
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};


// ============================================================================
// BLOCK 2: Sidebar (MapGenie Style) Component
// ============================================================================

const MapSidebar = ({ 
  isOpen, 
  filters, 
  setFilters, 
  searchQuery, 
  setSearchQuery, 
  markers 
}) => {
  const [expandedCats, setExpandedCats] = useState(
    Object.keys(categories).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const toggleCategory = (catKey) => {
    setExpandedCats(prev => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  const handleShowAll = () => setFilters(Object.keys(markerTypes));
  const handleHideAll = () => setFilters([]);

  const toggleFilter = (typeId) => {
    setFilters(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  // Calculate marker counts dynamically
  const getMarkerCount = (typeId) => markers.filter(m => m.type === typeId).length;
  const getCategoryCount = (catId) => markers.filter(m => markerTypes[m.type].category === catId).length;

  return (
    <div className={`
      flex flex-col h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 
      transition-all duration-300 ease-in-out absolute md:relative z-40
      ${isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full md:w-0 md:-translate-x-full'}
    `}>
      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-900 dark:text-white focus:ring-1 focus:ring-red-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Global Toggles */}
      <div className="flex gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button 
          onClick={handleShowAll}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <Eye className="w-4 h-4" /> Show All
        </button>
        <button 
          onClick={handleHideAll}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <EyeOff className="w-4 h-4" /> Hide All
        </button>
      </div>

      {/* Categories List (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {Object.entries(categories).map(([catKey, cat]) => {
          const catTypes = Object.entries(markerTypes).filter(([_, type]) => type.category === cat.id);
          const isExpanded = expandedCats[catKey];
          const totalCatCount = getCategoryCount(cat.id);
          
          return (
            <div key={catKey} className="border-b border-neutral-200 dark:border-neutral-800/50">
              {/* Category Header */}
              <button 
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-sm">{cat.label}</span>
                    <span className="text-[10px] text-red-500 font-medium tracking-widest">{cat.jp}</span>
                  </div>
                </div>
                <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold px-2 py-1 rounded-md">
                  {totalCatCount}
                </span>
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="pb-3 px-2">
                  {catTypes.map(([typeKey, type]) => {
                    const isActive = filters.includes(type.id);
                    const TypeIcon = type.icon;
                    const count = getMarkerCount(type.id);

                    return (
                      <button
                        key={type.id}
                        onClick={() => toggleFilter(type.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${isActive ? 'bg-neutral-50 dark:bg-neutral-900/40' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/20 opacity-70 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${type.color} shadow-sm`}>
                            <TypeIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-sm font-medium ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            {type.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-400 font-mono">{count}</span>
                          {/* MapGenie style Checkbox */}
                          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${isActive ? 'bg-red-500 border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                            {isActive && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ============================================================================
// BLOCK 3: Interactive Map Container Component
// ============================================================================

const InteractiveMap = ({ markers, setMarkers, activeFilters, searchQuery }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingMarker, setPendingMarker] = useState(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.5); // Start zoomed out so the whole map fits
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Zoom constraints
  const minScale = 0.2;
  const maxScale = 4;

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, maxScale));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, minScale));
  const handleReset = () => { setScale(0.5); setPosition({ x: 0, y: 0 }); };

  // Mouse drag logic
  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom logic
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.0015; // Slightly smoother zoom
    setScale(s => Math.min(Math.max(s + scaleAmount, minScale), maxScale));
  };

  // Map Double Click for adding markers
  const handleMapDoubleClick = (e) => {
    if (!isEditMode) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingMarker({ x, y });
  };

  const saveNewMarker = (markerData) => {
    setMarkers([...markers, { ...markerData, id: Date.now() }]);
    setPendingMarker(null);
  };

  const deleteMarker = (e, id) => {
    e.stopPropagation();
    if (!isEditMode) return;
    setMarkers(markers.filter(m => m.id !== id));
  };

  // File Export/Import
  const exportMap = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(markers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fh6_custom_map.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportMap = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setMarkers(imported);
          setIsEditMode(false);
        }
      } catch (err) {
        alert("Invalid map file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Filter markers based on sidebar selections AND search query
  const visibleMarkers = useMemo(() => {
    return markers.filter(m => {
      const typeVisible = activeFilters.includes(m.type);
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      return typeVisible && matchesSearch;
    });
  }, [markers, activeFilters, searchQuery]);

  return (
    <div className="relative flex-1 h-full bg-[#1a1c23] overflow-hidden">
      
      <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportMap} className="hidden" />

      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-black text-white/5 pointer-events-none select-none z-0 whitespace-nowrap">
        マップ
      </div>

      {/* Floating Toolbar (Right Side) */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-4">
        
        {/* Editor Controls */}
        <div className="bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
          <button 
            onClick={() => setIsEditMode(!isEditMode)} 
            className={`p-3 flex items-center justify-center transition-colors border-b border-neutral-200 dark:border-neutral-800 ${isEditMode ? 'bg-red-600 text-white hover:bg-red-700' : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            title={isEditMode ? "Lock Map (View Mode)" : "Unlock Map (Edit Mode)"}
          >
            {isEditMode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </button>
          
          {isEditMode && (
            <>
              <button onClick={exportMap} className="p-3 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border-b border-neutral-200 dark:border-neutral-800" title="Save Map">
                <Save className="w-5 h-5" />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-3 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors" title="Load Map">
                <Upload className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
          <button onClick={handleZoomIn} className="p-3 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border-b border-neutral-200 dark:border-neutral-800" title="Zoom In">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={handleReset} className="p-3 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border-b border-neutral-200 dark:border-neutral-800" title="Reset View">
            <Crosshair className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="p-3 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors" title="Zoom Out">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold tracking-widest uppercase flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Plus className="w-4 h-4" /> Double-click map to place marker
        </div>
      )}

      {/* Draggable/Zoomable Canvas */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="w-full h-full origin-center transition-transform duration-100 ease-out"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2100px] h-[1400px]"
            onDoubleClick={handleMapDoubleClick}
          >
            <img 
              src={MAP_IMAGE_URL} 
              alt="Interactive Map" 
              className={`w-full h-full rounded-xl shadow-2xl ${isEditMode ? 'opacity-90' : 'opacity-80'}`}
              draggable="false"
            />
            
            {/* Markers */}
            {visibleMarkers.map(marker => {
              const TypeConfig = markerTypes[marker.type];
              const Icon = TypeConfig.icon;
              return (
                <div 
                  key={marker.id}
                  className={`absolute group transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-20 ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-xl shadow-black/50 border-2 border-white ${TypeConfig.color}`}>
                    <Icon className="w-4 h-4 text-white drop-shadow-md" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-neutral-900/90 backdrop-blur border border-neutral-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg flex flex-col items-center">
                      <span>{marker.title}</span>
                      {isEditMode && (
                        <span className="text-[9px] text-red-400 mt-1 flex items-center gap-1 border-t border-neutral-700 w-full justify-center pt-1">
                          <Trash2 className="w-3 h-3" /> Click to delete
                        </span>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 border-b border-r border-neutral-700 transform rotate-45"></div>
                    </div>
                  </div>

                  {isEditMode && (
                    <div className="absolute inset-0 scale-150" onClick={(e) => deleteMarker(e, marker.id)}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {pendingMarker && (
        <AddMarkerModal 
          markerCoords={pendingMarker} 
          onSave={saveNewMarker} 
          onCancel={() => setPendingMarker(null)} 
        />
      )}
    </div>
  );
};

// ============================================================================
// Add Marker Modal Component
// ============================================================================
const AddMarkerModal = ({ markerCoords, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('FESTIVAL');

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black mb-4 text-neutral-900 dark:text-white uppercase tracking-wider">New Map Marker</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Marker Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none font-semibold"
            >
              {Object.values(markerTypes).map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Location Name</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ebisu Circuit"
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (!title.trim()) return;
              onSave({ ...markerCoords, title, type });
            }}
            disabled={!title.trim()}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Place Marker
          </button>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// MAIN PAGE COMPONENT (Export)
// ============================================================================

export default function MapPageApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [markers, setMarkers] = useState(initialMockMarkers);
  const [activeFilters, setActiveFilters] = useState(Object.keys(markerTypes));
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {/* Root Layout: Fixed height to prevent whole-page scrolling, handle scrolling inside components */}
      <div className="bg-white dark:bg-neutral-950 h-screen w-full text-neutral-900 dark:text-neutral-50 font-sans overflow-hidden selection:bg-red-500 selection:text-white transition-colors duration-300 flex flex-col">
        
        <NavigationBar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 flex overflow-hidden relative">
          
          <MapSidebar 
            isOpen={isSidebarOpen} 
            filters={activeFilters}
            setFilters={setActiveFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            markers={markers}
          />

          <InteractiveMap 
            markers={markers}
            setMarkers={setMarkers}
            activeFilters={activeFilters} 
            searchQuery={searchQuery}
          />
          
        </main>
      </div>
    </div>
  );
}