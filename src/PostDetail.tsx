import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send 
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useForum } from './contexts/ForumContext';
import { useAuth } from './contexts/AuthContext';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, addComment, likePost } = useForum();
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post Not Found</h2>
           <p className="text-gray-500 mb-6">The discussion you are looking for might have been removed or doesn't exist.</p>
           <button onClick={() => navigate('/forum')} className="text-primary hover:underline">Return to Forum</button>
        </div>
      </AppLayout>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    addComment(post.id, commentContent);
    setCommentContent('');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-0">
        
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 -mx-4 mb-4 border-b border-gray-200 dark:border-white/5 flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                 <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
             </button>
             <h1 className="font-bold text-lg text-gray-900 dark:text-white truncate">Discussion</h1>
        </div>

        <button 
            onClick={() => navigate('/forum')}
            className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
            <ChevronLeft className="w-5 h-5" />
            Back to Forum
        </button>

        {/* Post Content */}
        <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-6">
                {post.authorImage ? (
                    <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${post.authorImage}')` }}></div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {post.author.charAt(0)}
                    </div>
                )}
                <div>
                     <h1 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl">{post.author}</h1>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{post.timeAgo} • {post.category}</p>
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-gray-600 dark:text-gray-300 font-medium"
                >
                    <ThumbsUp className="w-5 h-5" />
                    {post.likes} Likes
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-medium ml-auto md:ml-0">
                    <MessageCircle className="w-5 h-5" />
                    {post.answers} Comments
                </div>
                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-gray-600 dark:text-gray-300 font-medium ml-auto">
                    <Share2 className="w-5 h-5" />
                    Share
                </button>
            </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white px-2">Comments ({post.comments.length})</h3>
            
            <div className="space-y-4">
                {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-white dark:bg-[#1a2e22] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div 
                                className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100 dark:border-white/10"
                                style={{ backgroundImage: `url('${comment.authorImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + comment.authorName}')` }}
                            ></div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{comment.authorName}</h4>
                                    <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{comment.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Comment Input */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1a2e22] border-t border-gray-100 dark:border-white/5 md:static md:bg-transparent md:dark:bg-transparent md:border-none md:p-0 z-40">
                <div className="max-w-4xl mx-auto flex items-start gap-3">
                    <div 
                         className="hidden md:block w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center border border-gray-200 dark:border-white/10"
                         style={{ backgroundImage: `url('${user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"}')` }}
                    ></div>
                    <form onSubmit={handleCommentSubmit} className="flex-1 relative">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder={user ? "Add to the discussion..." : "Log in to comment"}
                            disabled={!user}
                            rows={1} // Auto-grow could be added but keep simple
                            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-gray-100 dark:bg-[#1c2e24] border-transparent focus:bg-white dark:focus:bg-[#1a2e22] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none dark:text-white"
                        />
                        <button 
                            type="submit"
                            disabled={!user || !commentContent.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>

      </div>
    </AppLayout>
  );
}
