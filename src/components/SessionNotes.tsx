import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { LWWMap, mergeLWWMaps } from '../lib/crdt';
import { AlertCircle } from 'lucide-react';

interface SessionNotesProps {
  sessionId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  otherUserName: string;
  otherUserImage: string;
}

interface TypingIndicator {
  userId: string;
  userName: string;
  userImage: string;
  timestamp: number;
}

export function SessionNotes({
  sessionId,
  currentUserId,
  currentUserName,
  currentUserImage,
  otherUserName,
  otherUserImage
}: SessionNotesProps) {
  const [notes, setNotes] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState<TypingIndicator | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const crdtRef = useRef<LWWMap | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const lastKnownRemoteStateRef = useRef<LWWMap | null>(null);
  const isLocalUpdateRef = useRef(false);
  const offlineBufferRef = useRef<string[]>([]);
  const pollIntervalRef = useRef<number | null>(null);

  const storageKey = `session_notes_${sessionId}`;
  const typingKey = `session_typing_${sessionId}`;

  // Initialize CRDT from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        const crdt = LWWMap.fromJSON(data);
        crdtRef.current = crdt;
        lastKnownRemoteStateRef.current = crdt.clone();
        setNotes(crdt.getText());
      } else {
        crdtRef.current = new LWWMap('', currentUserId);
        lastKnownRemoteStateRef.current = new LWWMap('', currentUserId);
      }
    } catch (err) {
      console.error('Failed to initialize CRDT from localStorage:', err);
      setError('Failed to load notes. Please refresh the page.');
      crdtRef.current = new LWWMap('', currentUserId);
      lastKnownRemoteStateRef.current = new LWWMap('', currentUserId);
    }
  }, [sessionId, currentUserId]);

  // Save CRDT state to localStorage
  const saveToStorage = useCallback((crdt: LWWMap) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(crdt.toJSON()));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [storageKey]);

  // Poll for remote changes every 1 second
  useEffect(() => {
    pollIntervalRef.current = window.setInterval(() => {
      if (!crdtRef.current) return;

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          const remoteCrdt = LWWMap.fromJSON(data);
          
          // Check if remote state is different from last known
          const remoteText = remoteCrdt.getText();
          const localText = crdtRef.current.getText();
          
          if (remoteText !== localText || !isLocalUpdateRef.current) {
            // Merge remote changes
            const merged = mergeLWWMaps(crdtRef.current, remoteCrdt);
            const mergedText = merged.getText();
            
            // Only update if text actually changed
            if (mergedText !== localText) {
              crdtRef.current = merged;
              lastKnownRemoteStateRef.current = remoteCrdt.clone();
              setNotes(mergedText);
            }
          }
          
          isLocalUpdateRef.current = false;
        }
      } catch (err) {
        console.error('Failed to poll for remote changes:', err);
      }
    }, 1000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [storageKey]);

  // Handle tab visibility change (offline/online simulation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible - merge any buffered changes
        if (offlineBufferRef.current.length > 0 && crdtRef.current) {
          try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
              const data = JSON.parse(stored);
              const remoteCrdt = LWWMap.fromJSON(data);
              const merged = mergeLWWMaps(crdtRef.current, remoteCrdt);
              const mergedText = merged.getText();
              
              if (mergedText !== crdtRef.current.getText()) {
                crdtRef.current = merged;
                setNotes(mergedText);
              }
            }
          } catch (err) {
            console.error('Failed to merge buffered changes:', err);
          }
          offlineBufferRef.current = [];
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [storageKey]);

  // Poll for typing indicators
  useEffect(() => {
    const typingPollInterval = window.setInterval(() => {
      try {
        const storedTyping = localStorage.getItem(typingKey);
        if (storedTyping) {
          const typingData: TypingIndicator = JSON.parse(storedTyping);
          const now = Date.now();
          
          // Only show if typing happened in last 2 seconds and not from current user
          if (typingData.userId !== currentUserId && now - typingData.timestamp < 2000) {
            setOtherTyping(typingData);
          } else if (typingData.userId === currentUserId) {
            // Clear our own typing indicator after timeout
            if (now - typingData.timestamp > 2000) {
              localStorage.removeItem(typingKey);
            }
          }
        } else {
          setOtherTyping(null);
        }
      } catch (err) {
        console.error('Failed to poll typing indicator:', err);
      }
    }, 500);

    return () => clearInterval(typingPollInterval);
  }, [typingKey, currentUserId]);

  // Broadcast typing indicator
  const broadcastTyping = useCallback(() => {
    try {
      const typingData: TypingIndicator = {
        userId: currentUserId,
        userName: currentUserName,
        userImage: currentUserImage,
        timestamp: Date.now()
      };
      localStorage.setItem(typingKey, JSON.stringify(typingData));
    } catch (err) {
      console.error('Failed to broadcast typing:', err);
    }
  }, [currentUserId, currentUserName, currentUserImage, typingKey]);

  // Handle text change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!crdtRef.current || !textareaRef.current) return;

    const newText = e.target.value;
    const oldText = notes;
    
    try {
      isLocalUpdateRef.current = true;
      
      // Simple diff: find what changed
      if (newText.length > oldText.length) {
        // Character inserted
        const diffIndex = findDiffIndex(oldText, newText);
        if (diffIndex !== -1 && diffIndex < newText.length) {
          const char = newText[diffIndex];
          crdtRef.current.insertChar(diffIndex, char, currentUserId);
        }
      } else if (newText.length < oldText.length) {
        // Character deleted
        const diffIndex = findDiffIndex(newText, oldText);
        if (diffIndex !== -1 && diffIndex < oldText.length) {
          crdtRef.current.deleteChar(diffIndex, currentUserId);
        }
      } else {
        // Full text replacement (fallback)
        crdtRef.current.setText(newText, currentUserId);
      }
      
      const updatedText = crdtRef.current.getText();
      setNotes(updatedText);
      saveToStorage(crdtRef.current);
      
      // Broadcast typing
      broadcastTyping();
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set typing state
      setIsTyping(true);
      
      // Clear typing after 1 second of inactivity
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      // Clear error on successful update
      if (error) setError(null);
    } catch (err) {
      console.error('Failed to update CRDT:', err);
      setError('Failed to save changes. Please try again.');
    }
  };

  // Find the index where two strings differ
  const findDiffIndex = (str1: string, str2: string): number => {
    const minLen = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLen; i++) {
      if (str1[i] !== str2[i]) {
        return i;
      }
    }
    return minLen;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      // Clear typing indicator
      try {
        localStorage.removeItem(typingKey);
      } catch (err) {
        console.error('Failed to clear typing indicator:', err);
      }
    };
  }, [typingKey]);

  return (
    <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 dark:text-white">Session Notes</h4>
        <div className="flex items-center gap-2">
          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>You're typing...</span>
            </div>
          )}
          {otherTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="relative">
                <div 
                  className="w-5 h-5 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-[#1a2e22]"
                  style={{ backgroundImage: `url('${otherUserImage}')` }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#1a2e22] animate-pulse"></div>
              </div>
              <span>{otherUserName} is typing...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={notes}
        onChange={handleChange}
        placeholder="Take notes together... Both mentor and learner can type simultaneously."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-white text-sm min-h-[200px] resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
      />

      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
        <span>Changes sync automatically via CRDT</span>
        <span>{notes.length} characters</span>
      </div>
    </div>
  );
}

