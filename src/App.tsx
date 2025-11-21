
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Thermometer, Activity, History, 
  AlertCircle, Search, Zap, CheckCircle2, AlertTriangle, 
  Plus, ChevronDown, ChevronUp, MapPin, FileText, X, Aperture 
} from 'lucide-react';
import Navbar from './components/Navbar';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input';
import Select from './components/ui/Select';
import Textarea from './components/ui/Textarea';
import { AnalysisResult, RiskLevel, HistoryItem } from './types';

const App: React.FC = () => {
  // --- Main App State ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  // --- Camera State ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- Modal & Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    panelName: '',
    location: '',
    risk: RiskLevel.LOW,
    temperature: '',
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('thermal_guard_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('thermal_guard_history', JSON.stringify(history));
  }, [history]);

  // --- Camera Effect ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        if (isCameraOpen) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
          
          if (!isMounted) {
            // If component unmounted while waiting for permission
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (isMounted) {
          alert("Could not access camera. Please ensure permissions are granted and you are using a supported device.");
          setIsCameraOpen(false);
        }
      }
    };

    if (isCameraOpen) {
      startCamera();
    }

    // Cleanup function to stop tracks when camera closes or component unmounts
    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraOpen]);

  // --- Handlers: Camera ---
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL (jpeg for smaller size)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        setSelectedImage(dataUrl);
        setResult(null); // Clear previous analysis
        setIsCameraOpen(false);
      }
    }
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  // --- Handlers: Analysis ---
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const randomRisk = Math.random();
      let risk = RiskLevel.LOW;
      let temp = 45;
      let suggestion = "All readings normal. Routine check recommended.";
      
      if (randomRisk > 0.7) {
        risk = RiskLevel.HIGH;
        temp = 85 + Math.floor(Math.random() * 20);
        suggestion = "Immediate inspection required. Check breaker #2 and neutral busbar for loose connections.";
      } else if (randomRisk > 0.4) {
        risk = RiskLevel.MEDIUM;
        temp = 60 + Math.floor(Math.random() * 15);
        suggestion = "Monitor closely. Potential resistive heating detected at connection point.";
      }

      const newResult: AnalysisResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        risk,
        estimatedTemperature: temp,
        hotspotRegion: "Main Breaker / Busbar B",
        imageUrl: selectedImage,
        suggestion,
        panelName: `Panel ${Math.floor(Math.random() * 100) + 10}`
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 20)); // Keep last 20
      setIsAnalyzing(false);
    }, 1500);
  };

  // --- Handlers: Manual Record ---
  const openModal = () => {
    setManualForm({
      panelName: '',
      location: '',
      risk: RiskLevel.LOW,
      temperature: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleManualFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualForm(prev => ({ ...prev, [name]: value }));
  };

  const saveManualRecord = () => {
    if (!manualForm.panelName.trim()) {
      alert("Please enter a Panel Name");
      return;
    }

    const newRecord: HistoryItem = {
      id: `manual-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      risk: manualForm.risk,
      panelName: manualForm.panelName,
      location: manualForm.location || undefined,
      estimatedTemperature: manualForm.temperature ? parseFloat(manualForm.temperature) : undefined,
      notes: manualForm.notes || undefined,
      isManual: true,
      suggestion: "Manual entry record."
    };

    setHistory(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
  };

  // --- Handlers: UI ---
  const toggleRow = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case RiskLevel.MEDIUM: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case RiskLevel.LOW: return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 font-sans pb-10">
      <Navbar />

      <main className="container mx-auto p-4 space-y-6 max-w-4xl">
        
        {/* 1. Scan Section */}
        <Card 
          title="Scan Panel" 
          subtitle="Capture or upload a thermal image to analyze hotspots."
        >
          <div className="space-y-6">
            {/* Image/Video Container */}
            <div className="relative w-full aspect-video bg-dark-800 rounded-lg border-2 border-dashed border-dark-border flex flex-col items-center justify-center overflow-hidden group transition-colors hover:border-dark-800/50">
              
              {isCameraOpen ? (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Hidden canvas for capture */}
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10 px-4">
                     <Button variant="secondary" onClick={handleCloseCamera} leftIcon={<X className="w-4 h-4" />}>
                       Close Camera
                     </Button>
                     <Button variant="primary" onClick={handleCapture} leftIcon={<Aperture className="w-4 h-4" />}>
                       Capture
                     </Button>
                  </div>
                </>
              ) : selectedImage ? (
                <>
                  <img 
                    src={selectedImage} 
                    alt="Selected thermal scan" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button variant="secondary" size="sm" onClick={() => setSelectedImage(null)}>Remove Image</Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">No image selected</p>
                </div>
              )}
            </div>

            {/* Controls - Only show if camera is NOT open */}
            {!isCameraOpen && (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                  />
                  <Button 
                    variant="secondary" 
                    className="flex-1" 
                    onClick={() => setIsCameraOpen(true)}
                    leftIcon={<Camera className="w-4 h-4" />}
                  >
                    Use Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={triggerFileUpload}
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    Upload Image
                  </Button>
                </div>

                <div className="pt-2">
                   <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={!selectedImage}
                    isLoading={isAnalyzing}
                    onClick={handleAnalyze}
                    leftIcon={<Search className="w-4 h-4" />}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 2. Analysis Result Section */}
        <Card title="Analysis Result">
          {!result ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Run an analysis to see risk level and recommendations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-border">
                  <span className="text-sm text-gray-400">Risk Level</span>
                  <div className="flex items-center gap-2">
                    {getRiskIcon(result.risk)}
                    <Badge risk={result.risk} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-border">
                  <span className="text-sm text-gray-400">Est. Temperature</span>
                  <div className="flex items-center gap-2 text-white font-mono font-medium">
                    <Thermometer className="w-4 h-4 text-gray-500" />
                    {result.estimatedTemperature}°C
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-border">
                  <span className="text-sm text-gray-400">Hotspot</span>
                  <span className="text-sm text-white text-right">{result.hotspotRegion}</span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  Analyzed on {formatDate(result.timestamp)}
                </div>
              </div>
              <div className="bg-brand-600/5 border border-brand-500/20 rounded-lg p-4">
                <h4 className="text-brand-500 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Suggested Actions
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.suggestion}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* 3. History Section */}
        <Card 
          title="History" 
          action={
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={openModal}
                className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add manual record
              </Button>
              {history.length > 0 && (
                <button 
                  onClick={() => setHistory([])} 
                  className="text-xs text-gray-500 hover:text-white transition-colors ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          }
        >
          {history.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No recent scans found.
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-dark-border text-gray-400">
                    <th className="pb-3 font-medium pl-2">Time</th>
                    <th className="pb-3 font-medium">Panel</th>
                    <th className="pb-3 font-medium text-right pr-2">Risk</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/50">
                  {history.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr 
                        className={`group hover:bg-dark-800/50 cursor-pointer transition-colors ${expandedRowId === item.id ? 'bg-dark-800/50' : ''}`}
                        onClick={() => toggleRow(item.id)}
                      >
                        <td className="py-3 text-gray-300 whitespace-nowrap pl-2">
                          <div className="flex flex-col">
                            <span>{formatDate(item.timestamp)}</span>
                            {item.isManual && (
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Manual</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">
                          <div className="font-medium text-white">{item.panelName || 'Unknown Panel'}</div>
                          {item.location && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {item.location}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex justify-end">
                            <Badge risk={item.risk} />
                          </div>
                        </td>
                        <td className="py-3 text-center text-gray-500">
                          {expandedRowId === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                      </tr>
                      {expandedRowId === item.id && (
                        <tr className="bg-dark-800/30">
                          <td colSpan={4} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              {item.estimatedTemperature && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Thermometer className="w-4 h-4 text-gray-500" />
                                  <span>Temp: <span className="text-white font-mono">{item.estimatedTemperature}°C</span></span>
                                </div>
                              )}
                              
                              {item.hotspotRegion && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Zap className="w-4 h-4 text-gray-500" />
                                  <span>Hotspot: {item.hotspotRegion}</span>
                                </div>
                              )}

                              {item.notes && (
                                <div className="col-span-1 sm:col-span-2 mt-2 p-3 bg-dark-950 rounded border border-dark-border">
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                      <span className="text-xs font-medium text-gray-500 uppercase mb-1 block">Notes</span>
                                      <p className="text-gray-300 whitespace-pre-wrap">{item.notes}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {!item.notes && !item.location && !item.estimatedTemperature && (
                                <p className="text-gray-500 italic col-span-2">No additional details recorded.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Manual Entry Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Manual Inspection Record"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveManualRecord}>Save Record</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Panel Name / ID"
              name="panelName"
              placeholder="e.g. Distribution Panel A-2"
              value={manualForm.panelName}
              onChange={handleManualFormChange}
              autoFocus
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location (Optional)"
                name="location"
                placeholder="e.g. Basement"
                value={manualForm.location}
                onChange={handleManualFormChange}
              />
              
              <Input
                label="Est. Temperature (°C)"
                name="temperature"
                type="number"
                placeholder="e.g. 65"
                value={manualForm.temperature}
                onChange={handleManualFormChange}
              />
            </div>

            <Select
              label="Risk Level"
              name="risk"
              value={manualForm.risk}
              onChange={handleManualFormChange}
              options={[
                { value: RiskLevel.LOW, label: 'Low Risk' },
                { value: RiskLevel.MEDIUM, label: 'Medium Risk' },
                { value: RiskLevel.HIGH, label: 'High Risk' },
              ]}
            />

            <Textarea
              label="Notes / Observations"
              name="notes"
              placeholder="Describe any issues, visual inspection results, or immediate actions taken..."
              value={manualForm.notes}
              onChange={handleManualFormChange}
              rows={4}
            />
          </div>
        </Modal>

      </main>
    </div>
  );
};

export default App;