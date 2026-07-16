import { useState } from 'react';
import { X, MessageCircle, Loader2 } from 'lucide-react';
import { useForum } from '../contexts/ForumContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { createPost } = useForum();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [loading, setLoading] = useState(false);
  
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    createPost(title, content, category);
    setLoading(false);
    onClose();
    setTitle('');
    setContent('');
    setCategory('Tech');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" aria-modal="true" role="dialog">
      <div ref={modalRef} className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Create New Post
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input 
              id="post-title"
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="flex gap-2">
              {['Tech', 'Business', 'Career'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    category === cat 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Content
            </label>
            <textarea 
              id="post-content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question or topic in detail..."
              rows={5}
              className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post to Community'}
          </button>
        </form>
      </div>
    </div>
  );
}
