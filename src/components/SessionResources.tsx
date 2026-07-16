import React, { useState, useRef } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { Paperclip, Link as LinkIcon, FileText, Trash2, Plus, X, Download, File, ExternalLink, AlertCircle } from 'lucide-react';

export function SessionResources({ sessionId, isMentor }: { sessionId: string, isMentor: boolean }) {
  const { sessions, addSessionResource, removeSessionResource } = useBooking();
  const session = sessions.find(s => s.id === sessionId);
  
  const [isAdding, setIsAdding] = useState(false);
  const [resourceType, setResourceType] = useState<'link' | 'note' | 'file'>('link');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!session) return null;

  const resources = session.resources || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      setError('File size must be less than 200KB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        setError("Title is required");
        return;
    }
    if (resourceType !== 'file' && !content) {
        setError("Content is required");
        return;
    }
    if (resourceType === 'file' && !content) {
        setError("Please select a file");
        return;
    }

    addSessionResource(sessionId, {
      title,
      type: resourceType,
      content
    });

    // Reset
    setIsAdding(false);
    setTitle('');
    setContent('');
    setError('');
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'link': return <LinkIcon className="w-4 h-4" />;
      case 'file': return <Paperclip className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 dark:text-white">Session Resources</h4>
        {isMentor && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {isAdding && isMentor && (
        <div className="bg-gray-50 dark:bg-[#1a2e22]/50 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-4 text-sm">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-slate-700 dark:text-gray-300">New Resource</h5>
            <button onClick={() => { setIsAdding(false); setError(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex gap-2 mb-4">
            <button 
                onClick={() => { setResourceType('link'); setContent(''); setError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${resourceType === 'link' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300' : 'bg-white border-gray-200 text-gray-600 dark:bg-transparent dark:border-white/10 dark:text-gray-400'}`}
            >
                Link
            </button>
            <button 
                onClick={() => { setResourceType('note'); setContent(''); setError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${resourceType === 'note' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300' : 'bg-white border-gray-200 text-gray-600 dark:bg-transparent dark:border-white/10 dark:text-gray-400'}`}
            >
                Note
            </button>
             <button 
                onClick={() => { setResourceType('file'); setContent(''); setError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${resourceType === 'file' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300' : 'bg-white border-gray-200 text-gray-600 dark:bg-transparent dark:border-white/10 dark:text-gray-400'}`}
            >
                File
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <input 
                    type="text" 
                    placeholder="Title (e.g., Reading Material)" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-white text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {resourceType === 'link' && (
                <input 
                    type="url" 
                    placeholder="https://..." 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-white text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            )}

            {resourceType === 'note' && (
                <textarea 
                    placeholder="Write your notes here... (Supports basic text)" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-white text-sm min-h-[100px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            )}

            {resourceType === 'file' && (
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/20 dark:file:text-emerald-400"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Max size: 200KB</p>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" /> {error}
                </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                Save Resource
            </button>
          </form>
        </div>
      )}

      {resources.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2 italic">No resources shared yet.</p>
      ) : (
          <div className="space-y-2">
            {resources.map(res => (
                <div key={res.id} className="flex items-start justify-between bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 p-3 rounded-xl hover:border-emerald-500/30 transition-colors group">
                    <div className="flex gap-3 min-w-0">
                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                            {renderIcon(res.type)}
                        </div>
                        <div className="min-w-0">
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm truncate">{res.title}</h5>
                            <p className="text-[10px] text-gray-400">{new Date(res.addedAt).toLocaleDateString()}</p>
                            
                            {res.type === 'note' && (
                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-2 rounded-lg whitespace-pre-wrap">
                                    {res.content}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                        {res.type === 'link' && (
                            <a href={res.content} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {res.type === 'file' && (
                            <a href={res.content} download={res.title} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md">
                                <Download className="w-4 h-4" />
                            </a>
                        )}
                        {isMentor && (
                            <button onClick={() => removeSessionResource(sessionId, res.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
}
