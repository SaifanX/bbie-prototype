'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Cpu, 
  Layers, Lock, ShieldCheck, Loader2, HelpCircle, Zap, RefreshCw, 
  Play, ArrowRight, ArrowDown, Database, Sparkles, Check
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ColumnMapping {
  entity_name: string;
  address: string;
  pincode: string;
  pan: string;
  gstin: string;
  source_id: string;
}

const DEPARTMENTS = [
  { id: 'Factories_&_Boilers', name: 'Factories & Boilers Department' },
  { id: 'Labour_Department', name: 'Labour Department' },
  { id: 'Shops_&_Establishments', name: 'Shops & Establishments System' },
  { id: 'Commercial_Taxes', name: 'Commercial Taxes Department' },
  { id: 'Municipal_Licenses', name: 'Municipal Trade Licenses (ULB)' }
];

export default function IngestionHubPage() {
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].id);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  
  // Column mapping state
  const [mapping, setMapping] = useState<ColumnMapping>({
    entity_name: '',
    address: '',
    pincode: '',
    pan: '',
    gstin: '',
    source_id: ''
  });

  // Preview & Processing state
  const [previewRows, setPreviewRows] = useState<{ raw: string; translated: string; status: 'translating' | 'translated' | 'idle' }[]>([]);
  const [isTranslatingPreview, setIsTranslatingPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestionResults, setIngestionResults] = useState<any | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Triggered when file is dragged or dropped
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Process the CSV file to extract headers and preview rows
  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert("Invalid format: Please upload a standard CSV file.");
      return;
    }

    setFile(selectedFile);
    setIngestionResults(null);
    const text = await selectedFile.text();
    
    // Very simple CSV parser to get headers and rows
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return;

    // Parse headers
    // Regex matches values, accounting for quotes
    const parseCSVLine = (line: string) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    setCsvHeaders(headers);

    const rows: Record<string, string>[] = [];
    const previewDataCount = Math.min(lines.length, 6); // First 5 data rows
    
    for (let i = 1; i < lines.length; i++) {
      const vals = parseCSVLine(lines[i]);
      if (vals.length === headers.length) {
        const rowObj: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowObj[header] = vals[index];
        });
        rows.push(rowObj);
      }
    }
    setCsvRows(rows);

    // Smart Suggestion Mapping
    const newMapping: ColumnMapping = {
      entity_name: '',
      address: '',
      pincode: '',
      pan: '',
      gstin: '',
      source_id: ''
    };

    // Dictionary of semantic anchors
    const semanticKeywords: Record<keyof ColumnMapping, string[]> = {
      entity_name: ['name', 'entity', 'business', 'company', 'firm', 'ಹೆಸರು', 'ಉದ್ಯಮ', 'ಸ್ಥಾಪನೆ'],
      address: ['address', 'location', 'street', 'premises', 'ವಿಳಾಸ', 'ಸ್ಥಳ'],
      pincode: ['pincode', 'pin', 'zip', 'postal', 'ಪಿನ್', 'ಪಿನ್ಕೋಡ್'],
      pan: ['pan', 'tax_id', 'income_tax', 'ಪ್ಯಾನ್'],
      gstin: ['gstin', 'gst', 'gst_no', 'ಜಿಎಸ್ಟಿ'],
      source_id: ['id', 'source_id', 'code', 'reg_no', 'ಕ್ರಮಸಂಖ್ಯೆ']
    };

    headers.forEach(h => {
      const lowerHeader = h.toLowerCase().replace(/[^a-z0-9\u0C80-\u0CFF]/gi, '');
      Object.entries(semanticKeywords).forEach(([key, keywords]) => {
        const fieldKey = key as keyof ColumnMapping;
        if (!newMapping[fieldKey]) {
          const match = keywords.some(keyword => lowerHeader.includes(keyword));
          if (match) {
            newMapping[fieldKey] = h;
          }
        }
      });
    });

    // Fallbacks if no match
    if (!newMapping.entity_name && headers.length > 0) newMapping.entity_name = headers[0];
    if (!newMapping.address && headers.length > 1) newMapping.address = headers[1];

    setMapping(newMapping);
  };

  // Triggers live preview translation
  useEffect(() => {
    if (!file || !mapping.entity_name) return;

    const generateTranslationPreview = async () => {
      setIsTranslatingPreview(true);
      
      const rowsToTranslate = csvRows.slice(0, 5);
      const tempPreview = rowsToTranslate.map(row => {
        const rawName = row[mapping.entity_name] || '';
        return {
          raw: rawName,
          translated: 'Normalizing...',
          status: 'translating' as const
        };
      });
      setPreviewRows(tempPreview);

      try {
        const resolvedPreviews = await Promise.all(
          rowsToTranslate.map(async (row, idx) => {
            const rawName = row[mapping.entity_name] || '';
            if (!rawName) return { raw: '', translated: 'N/A', status: 'translated' as const };
            
            // Check if Kannada Unicode block is present
            const isKannada = /[\u0C80-\u0CFF]/.test(rawName);
            if (!isKannada) {
              return { raw: rawName, translated: rawName, status: 'translated' as const };
            }

            // Real-time API hit to /api/v1/resolve to translate/normalize
            // (We send sovereignty mode full mask just to run the translation/resolution logic fast)
            const response = await fetch('/api/v1/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ entity_name: rawName })
            });
            const data = await response.json();
            
            // The API returns the translated name if it translated it
            // Or we look at the results and extract the translated name
            const translatedName = data.results?.[0]?.business?.name || rawName;
            
            return {
              raw: rawName,
              translated: translatedName,
              status: 'translated' as const
            };
          })
        );
        setPreviewRows(resolvedPreviews);
      } catch (err) {
        console.error("Preview translation failed:", err);
      } finally {
        setIsTranslatingPreview(false);
      }
    };

    generateTranslationPreview();
  }, [file, mapping.entity_name, csvRows]);

  const handleMappingChange = (field: keyof ColumnMapping, val: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Submit file for full batch processing
  const handleIngest = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProcessingProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('department', selectedDept);
      formData.append('mapping', JSON.stringify(mapping));

      // Hit our new CSV Ingest endpoint
      const response = await fetch('/api/v1/ingest/csv', {
        method: 'POST',
        headers: {
          'x-bbie-token': 'PILOT_MUNICIPAL_INGEST_991'
        },
        body: formData
      });

      setProcessingProgress(60);
      const data = await response.json();
      setProcessingProgress(100);
      setIngestionResults(data);
    } catch (err) {
      alert("Batch ingestion failed. Check api/v1/ingest/csv route logs.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setPreviewRows([]);
    setIngestionResults(null);
    setProcessingProgress(0);
    setMapping({
      entity_name: '',
      address: '',
      pincode: '',
      pan: '',
      gstin: '',
      source_id: ''
    });
  };

  return (
    <div className="flex-1 bg-[#08080a] text-zinc-100 p-6 sm:p-8 min-h-screen overflow-y-auto selection:bg-orange-500/30">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] block mb-2">Ingestion Layer</span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Department Data Ingest Portal</h1>
          <p className="text-zinc-500 text-xs font-mono mt-1">Sovereign Data Ingestion, Translation, & Active Resolution</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl shadow-md">
          <Lock size={14} className="text-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Sovereignty Shield Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Upload & Configuration (7 Cols) */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Section 1: Source & Department Selection */}
          <div className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-[32px] shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 font-mono text-xs">01</span>
              Source Department Configuration
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Authorized Department Node</label>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-orange-500/50 shadow-inner font-bold"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">Data will be resolved and archived under this registry identity.</p>
            </div>
          </div>

          {/* Section 2: Drag & Drop Upload Zone */}
          <div className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-[32px] shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 font-mono text-xs">02</span>
              Sovereign CSV Upload
            </h3>

            {!file ? (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden bg-zinc-950/20",
                  dragActive 
                    ? "border-orange-500 bg-orange-500/5" 
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
                )}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-400 group-hover:scale-105 group-hover:text-orange-500 transition-all shadow-md">
                  <Upload size={28} />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Select Departmental Registry File</h4>
                <p className="text-zinc-500 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
                  Drag and drop your registry CSV file here, or click to browse local files. Only raw `.csv` format supported.
                </p>
                <div className="mt-8 flex justify-center gap-4 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-orange-500" /> Edge PII Scrubbing</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-orange-500" /> UTF-8 Kannada Support</span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white truncate max-w-xs">{file.name}</h4>
                    <p className="text-zinc-500 text-xs font-mono mt-1">{(file.size / 1024).toFixed(1)} KB • {csvRows.length} Rows Identified</p>
                  </div>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md"
                >
                  Remove File
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Schema Mapper UI */}
          {file && csvHeaders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-[32px] shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 font-mono text-xs">03</span>
                  Sovereign Schema Mapper
                </h3>
                <span className="flex items-center gap-1.5 text-[9px] bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded text-orange-500 font-black uppercase tracking-widest shadow-sm">
                  <Sparkles size={11} /> Smart Suggester Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(mapping) as Array<keyof ColumnMapping>).map((field) => {
                  const label = field.replace('_', ' ').toUpperCase();
                  const isRequired = field === 'entity_name';
                  return (
                    <div key={field} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                          {label} {isRequired && <span className="text-orange-500 font-black">*</span>}
                        </label>
                      </div>
                      <select
                        value={mapping[field]}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                      >
                        <option value="">-- Skip Field --</option>
                        {csvHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              {/* Submit Ingestion */}
              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                  onClick={handleIngest}
                  disabled={isProcessing || !mapping.entity_name}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-orange-500/10"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Ingesting & Resolving Batch...
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Execute Batch Ingestion
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Previews & Real-time Stats (5 Cols) */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* Live Translation Preview Table */}
          {file && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-[32px] shadow-xl space-y-6 flex flex-col min-h-[300px]"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Normalization Preview</h3>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">Translation Validation Stream</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 shadow-sm">
                  <RefreshCw size={14} className={isTranslatingPreview ? "animate-spin" : ""} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {previewRows.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10 font-mono text-xs">
                    Select a column mapping to trigger preview.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {previewRows.map((row, idx) => (
                      <div 
                        key={idx} 
                        className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] text-zinc-500 uppercase block mb-1 font-bold">Raw input</span>
                          <span className="text-zinc-200 block truncate font-black">{row.raw}</span>
                        </div>
                        <div className="hidden sm:block text-zinc-700 shrink-0">
                          <ArrowRight size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] text-zinc-500 uppercase block mb-1 font-bold">Normalized name</span>
                          {row.status === 'translating' ? (
                            <span className="text-orange-500/50 animate-pulse font-bold block">Normalizing...</span>
                          ) : (
                            <span className="text-orange-500 block truncate font-black">{row.translated}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Real-time Ingestion Stats Card */}
          {isProcessing || ingestionResults ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#121215] border border-zinc-800 p-6 sm:p-8 rounded-[32px] shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Ingestion Stats Monitor</h3>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">Real-time Node Resolution</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm" />
              </div>

              {isProcessing && (
                <div className="space-y-4 py-6 text-center">
                  <Loader2 size={32} className="text-orange-500 animate-spin mx-auto" />
                  <p className="text-xs font-black text-zinc-300 uppercase tracking-widest">Processing Ingestion Stream</p>
                  
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800 max-w-xs mx-auto">
                    <motion.div 
                      className="h-full bg-orange-500 shadow-md shadow-orange-500/50" 
                      animate={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Resolving target business entities</span>
                </div>
              )}

              {ingestionResults && (
                <div className="space-y-6">
                  {/* Grid of Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                      label="Total Ingested" 
                      value={ingestionResults.metrics.total_ingested} 
                      color="indigo" 
                    />
                    <StatCard 
                      label="Translations Run" 
                      value={ingestionResults.metrics.kannada_translated} 
                      color="orange" 
                    />
                    <StatCard 
                      label="Auto-Merged (High Match)" 
                      value={ingestionResults.metrics.auto_merged} 
                      color="emerald" 
                    />
                    <StatCard 
                      label="Sent to Triage Queue" 
                      value={ingestionResults.metrics.sent_to_triage} 
                      color="amber" 
                    />
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between font-mono text-[10px] shadow-inner">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">New Registries Created:</span>
                    <span className="text-white font-black text-xs">{ingestionResults.metrics.new_entities}</span>
                  </div>

                  {/* Batch Success Summary Banner */}
                  <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex items-start gap-4">
                    <CheckCircle2 size={20} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Batch Process Complete</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        The registry CSV was processed successfully. Unambiguous records have been auto-merged into Golden Records. Entities requiring human review have been routed to the **Review Workspace** queue.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Empty State Guidance */
            <div className="border border-zinc-800 bg-zinc-900/10 border-dashed rounded-[32px] p-10 text-center opacity-40 min-h-[300px] flex flex-col items-center justify-center">
              <Database size={40} className="text-zinc-600 mb-4 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Telemetry Monitor Idle</h4>
              <p className="text-[10px] text-zinc-500 font-medium max-w-xs mt-2 font-mono uppercase tracking-tighter">
                Upload a registry file in the left panel to initialize live normalization preview and stats tracking.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'indigo' | 'orange' | 'emerald' | 'amber' }) {
  const styles = {
    indigo: 'text-zinc-300 border-zinc-800 bg-zinc-950',
    orange: 'text-orange-500 border-orange-500/10 bg-orange-500/5',
    emerald: 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5',
    amber: 'text-amber-500 border-amber-500/10 bg-amber-500/5'
  };

  return (
    <div className={cn("p-5 border rounded-2xl flex flex-col justify-between shadow-sm", styles[color])}>
      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-3">{label}</span>
      <span className="text-3xl font-black font-mono tracking-tighter">{value}</span>
    </div>
  );
}
