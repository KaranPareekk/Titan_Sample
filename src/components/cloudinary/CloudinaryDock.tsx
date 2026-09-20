import React, { useState, useRef } from 'react';
import {
  Cloud,
  X,
  Upload,
  Sliders,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Settings2,
  Trash2,
  Sparkles,
  Loader2,
  Maximize2,
  Camera,
  FileCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  CloudinaryService,
  CloudinaryAsset,
  CloudinaryTransformOptions,
  CloudinaryConfig,
} from '../../services/cloudinary';
import { CloudinaryImage } from '../common/CloudinaryImage';

interface CloudinaryDockProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode?: (snippet: string) => void;
}

export const CloudinaryDock: React.FC<CloudinaryDockProps> = ({
  isOpen,
  onClose,
  onInsertCode,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'vault' | 'studio' | 'diagrams'>('vault');
  const [assets, setAssets] = useState<CloudinaryAsset[]>(() =>
    CloudinaryService.getTrackedAssets()
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Config settings sub-drawer
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [cloudNameInput, setCloudNameInput] = useState<string>(() =>
    CloudinaryService.getConfig().cloudName
  );
  const [uploadPresetInput, setUploadPresetInput] = useState<string>(() =>
    CloudinaryService.getConfig().uploadPreset
  );
  const [configSavedNotice, setConfigSavedNotice] = useState<boolean>(false);

  // Transformation Studio state
  const [selectedAsset, setSelectedAsset] = useState<CloudinaryAsset>(() => {
    const list = CloudinaryService.getTrackedAssets();
    return list[0] || {
      id: 'default',
      name: 'Sample Architecture Diagram',
      publicId: 'cld-sample-2',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      format: 'jpg',
      bytes: 142800,
      createdAt: Date.now(),
    };
  });

  const [transformOptions, setTransformOptions] = useState<CloudinaryTransformOptions>({
    width: 600,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  });
  const [effect, setEffect] = useState<'none' | 'blur' | 'grayscale' | 'sharpen'>('none');
  const [codeLanguage, setCodeLanguage] = useState<'react' | 'html' | 'markdown' | 'sdk'>('react');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isConfigured = CloudinaryService.isConfigured();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = () => {
    CloudinaryService.saveConfig({
      cloudName: cloudNameInput.trim(),
      uploadPreset: uploadPresetInput.trim(),
    });
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setShowConfig(false);
    }, 1200);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      if (!isConfigured) {
        // Simulated local fallback asset if credentials missing
        const fakeAsset: CloudinaryAsset = {
          id: `local_asset_${Date.now()}`,
          name: file.name,
          publicId: `titan_demo/${file.name.replace(/\.[^/.]+$/, '')}`,
          url: URL.createObjectURL(file),
          format: file.type.split('/')[1] || 'png',
          bytes: file.size,
          createdAt: Date.now(),
          tag: 'LOCAL',
        };
        CloudinaryService.saveTrackedAsset(fakeAsset);
        const updated = CloudinaryService.getTrackedAssets();
        setAssets(updated);
        setSelectedAsset(fakeAsset);
      } else {
        const res = await CloudinaryService.uploadImage(file, {
          folder: 'titan_os/engineering_assets',
          tags: ['titan_os', 'engineering_diagram'],
        });
        const newAsset: CloudinaryAsset = {
          id: `cld_${Date.now()}`,
          name: file.name,
          publicId: res.public_id,
          url: res.secure_url,
          format: res.format,
          bytes: res.bytes,
          createdAt: Date.now(),
          tag: 'CLOUDINARY',
        };
        CloudinaryService.saveTrackedAsset(newAsset);
        const updated = CloudinaryService.getTrackedAssets();
        setAssets(updated);
        setSelectedAsset(newAsset);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAsset = (id: string) => {
    CloudinaryService.deleteTrackedAsset(id);
    const updated = CloudinaryService.getTrackedAssets();
    setAssets(updated);
    if (selectedAsset.id === id && updated.length > 0) {
      setSelectedAsset(updated[0]);
    }
  };

  const generatedCode = React.useMemo(() => {
    const targetId = selectedAsset.publicId || selectedAsset.url;
    switch (codeLanguage) {
      case 'react':
        return CloudinaryService.generateReactSnippet(targetId, transformOptions);
      case 'html':
        return CloudinaryService.generateHtmlSnippet(targetId, transformOptions);
      case 'markdown':
        return CloudinaryService.generateMarkdownSnippet(targetId, transformOptions);
      case 'sdk':
        return CloudinaryService.generateSdkSnippet(targetId, transformOptions, 'javascript');
      default:
        return '';
    }
  }, [selectedAsset, transformOptions, codeLanguage]);

  return (
    <aside
      id="cloudinary-dock"
      aria-label="Cloudinary Engineering Dock"
      className="w-full sm:w-[420px] xl:w-[460px] h-full bg-[#090d16] border-l border-white/[0.1] shadow-2xl flex flex-col z-30 select-none overflow-hidden shrink-0 font-sans"
    >
      {/* 1. TOP DOCK HEADER */}
      <header className="px-4 py-3 bg-[#0c1220] border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-xs font-bold text-white tracking-wide uppercase">
                Cloudinary Dock
              </h2>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isConfigured
                    ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60'
                    : 'text-amber-300 border-amber-500/40 bg-amber-950/60'
                }`}
              >
                {isConfigured ? 'LIVE CDN' : 'DEMO MODE'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">
              Engineering Media & Asset Pipeline
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Direct Cloudinary Web Console */}
          <a
            href={CloudinaryService.getConsoleUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-cyan-300 border border-white/[0.06] transition-colors"
            title="Open Cloudinary Console in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close Dock */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] cursor-pointer transition-colors"
            title="Close Cloudinary Dock"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. DOCK NAVIGATION TABS */}
      <nav className="px-3 py-2 bg-[#070a12] border-b border-white/[0.06] flex items-center justify-between gap-1 shrink-0 font-mono text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Vault ({assets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Transform Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diagrams')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagrams'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Snapshots</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className={`p-1 rounded cursor-pointer transition-colors ${
            showConfig ? 'text-cyan-300 bg-cyan-950/60' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Cloudinary API Credentials"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* CREDENTIALS CONFIG ACCORDION */}
      {showConfig && (
        <div className="p-3 bg-[#0d1424] border-b border-cyan-500/30 text-xs font-mono flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" /> Cloudinary Credentials
            </span>
            <span className="text-[9px] text-zinc-400">Unsigned Direct Upload</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Cloud Name:</label>
              <input
                type="text"
                value={cloudNameInput}
                onChange={(e) => setCloudNameInput(e.target.value)}
                placeholder="e.g. dt9k..."
                className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Upload Preset:</label>
              <input
                type="text"
                value={uploadPresetInput}
                onChange={(e) => setUploadPresetInput(e.target.value)}
                placeholder="e.g. titan_preset"
                className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Find in Cloudinary Console</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold cursor-pointer"
            >
              {configSavedNotice ? 'Saved!' : 'Save Config'}
            </button>
          </div>
        </div>
      )}

      {/* 3. DOCK BODY CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ==================== TAB 1: ASSET VAULT ==================== */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            {/* Direct Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/30 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  <span className="text-xs font-mono text-cyan-300">
                    Streaming direct to Cloudinary CDN...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Upload Diagram or Asset
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Drop PNG, JPG, or SVG to generate instant CDN delivery URLs
                  </span>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {uploadError}
              </div>
            )}

            {/* Asset List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Stored Project Assets ({assets.length})</span>
                <span className="text-[10px]">Cloudinary CDN</span>
              </div>

              {assets.map((asset) => {
                const isSelected = selectedAsset.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    className={`p-3 rounded-xl border transition-all flex gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        setSelectedAsset(asset);
                        setActiveTab('studio');
                      }}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-black/50 border border-white/[0.08] shrink-0 cursor-pointer relative group"
                      title="Click to open in Transformation Studio"
                    >
                      <CloudinaryImage
                        src={asset.url}
                        alt={asset.name}
                        transform={{ width: 128, height: 128, crop: 'fill' }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-white truncate">{asset.name}</h4>
                          <button
                            type="button"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer"
                            title="Remove from vault"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 block truncate">
                          {asset.publicId} • {(asset.bytes / 1024).toFixed(0)} KB
                        </span>
                      </div>

                      {/* Action Chips */}
                      <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleCopy(asset.url, `cdn_${asset.id}`)}
                          className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedKey === `cdn_${asset.id}` ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                          <span>CDN URL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(`![${asset.name}](${asset.url})`, `md_${asset.id}`)
                          }
                          className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedKey === `md_${asset.id}` ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <FileCode className="w-2.5 h-2.5" />
                          )}
                          <span>Markdown</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setActiveTab('studio');
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sliders className="w-2.5 h-2.5" />
                          <span>Studio</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: TRANSFORMATION STUDIO ==================== */}
        {activeTab === 'studio' && (
          <div className="space-y-4">
            {/* Live Transformed Preview Canvas */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live CDN Transformation
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                  Auto-Optimized
                </span>
              </div>

              {/* Preview Image Frame */}
              <div className="w-full h-48 rounded-lg overflow-hidden bg-zinc-950 border border-white/[0.06] flex items-center justify-center relative group">
                <CloudinaryImage
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  transform={transformOptions}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Transformation Metrics */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/[0.06]">
                <span>
                  Asset: <strong className="text-zinc-200">{selectedAsset.name}</strong>
                </span>
                <span className="text-cyan-400">
                  {transformOptions.width}x{transformOptions.height} • {transformOptions.crop}
                </span>
              </div>
            </div>

            {/* Interactive Transformation Controls */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono text-xs">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                URL Transformation Parameters
              </span>

              {/* Dimensions: Width & Height */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    Width: {transformOptions.width}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="50"
                    value={transformOptions.width || 600}
                    onChange={(e) =>
                      setTransformOptions({ ...transformOptions, width: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    Height: {transformOptions.height}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={transformOptions.height || 400}
                    onChange={(e) =>
                      setTransformOptions({ ...transformOptions, height: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Crop Mode & Format */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Crop Mode (c_):</label>
                  <select
                    value={transformOptions.crop}
                    onChange={(e) =>
                      setTransformOptions({
                        ...transformOptions,
                        crop: e.target.value as any,
                      })
                    }
                    className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="fill">fill (Smart Fill)</option>
                    <option value="thumb">thumb (Face/Object)</option>
                    <option value="scale">scale (Maintain Ratio)</option>
                    <option value="fit">fit (Fit Bounds)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Format (f_):</label>
                  <select
                    value={transformOptions.format}
                    onChange={(e) =>
                      setTransformOptions({
                        ...transformOptions,
                        format: e.target.value as any,
                      })
                    }
                    className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="auto">f_auto (WebP/AVIF)</option>
                    <option value="webp">webp</option>
                    <option value="avif">avif</option>
                    <option value="png">png</option>
                    <option value="jpg">jpg</option>
                  </select>
                </div>
              </div>

              {/* Quality & Gravity */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Quality (q_):</label>
                  <select
                    value={transformOptions.quality}
                    onChange={(e) =>
                      setTransformOptions({
                        ...transformOptions,
                        quality: e.target.value as any,
                      })
                    }
                    className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="auto">q_auto (Perceptual)</option>
                    <option value="auto:good">q_auto:good</option>
                    <option value="auto:eco">q_auto:eco</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Gravity (g_):</label>
                  <select
                    value={transformOptions.gravity}
                    onChange={(e) =>
                      setTransformOptions({
                        ...transformOptions,
                        gravity: e.target.value as any,
                      })
                    }
                    className="w-full bg-black/60 border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="auto">g_auto (AI Salience)</option>
                    <option value="face">g_face (Face Detect)</option>
                    <option value="center">g_center (Center)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Multi-Language Code Snippet Generator */}
            <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Export Code
                </span>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded border border-white/[0.06]">
                  {(['react', 'html', 'markdown', 'sdk'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setCodeLanguage(lang)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase cursor-pointer ${
                        codeLanguage === lang
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display Area */}
              <div className="relative">
                <pre className="p-3 rounded-lg bg-black/80 border border-white/[0.06] text-cyan-300 text-[11px] overflow-x-auto leading-relaxed max-h-40">
                  {generatedCode}
                </pre>

                <button
                  type="button"
                  onClick={() => handleCopy(generatedCode, 'code_snippet')}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-white/[0.08] hover:bg-white/[0.15] text-[10px] text-white flex items-center gap-1 cursor-pointer transition-colors shadow"
                >
                  {copiedKey === 'code_snippet' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === 'code_snippet' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: DIAGRAM SNAPSHOTS ==================== */}
        {activeTab === 'diagrams' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col gap-2">
              <span className="font-bold text-sm text-cyan-300 flex items-center gap-1.5 font-tech">
                <Camera className="w-4 h-4 text-cyan-400" /> System Blueprint Archiver
              </span>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                Capture circuit schematics from Digital Logic Lab, AST trees from Algorithms, and relational diagrams from SQL Workbench to Cloudinary CDN with immutable URLs.
              </p>
            </div>

            {/* Snapshot Actions */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-zinc-400 font-bold block">
                Direct Lab Integrations
              </span>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Digital Logic Circuit Schematics</h4>
                  <span className="text-[10px] text-zinc-500">Auto-tag: #circuit_schematic</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">DBMS Entity-Relationship Graph</h4>
                  <span className="text-[10px] text-zinc-500">Auto-tag: #schema_graph</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Algorithms & Tree State Trace</h4>
                  <span className="text-[10px] text-zinc-500">Auto-tag: #dsa_graph</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  READY
                </span>
              </div>
            </div>

            {/* Documentation Tip */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] text-zinc-400 space-y-1.5 font-sans">
              <div className="flex items-center gap-1 text-cyan-400 font-mono font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" /> CDN PERMANENCE GUARANTEE
              </div>
              <p>
                Images stored on Cloudinary are globally replicated across Multi-CDN edges. You can paste the generated markdown directly into your GitHub repository README or project documentation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. DOCK FOOTER */}
      <footer className="px-4 py-2.5 bg-[#0c1220] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px]">
            {isConfigured ? `Cloud: ${cloudNameInput}` : 'Cloudinary Demo'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
        >
          {showConfig ? 'Hide Config' : 'Configure API'}
        </button>
      </footer>
    </aside>
  );
};
