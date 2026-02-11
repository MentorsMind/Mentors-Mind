import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Search, 
  ThumbsUp, 
  Share2, 
  Plus
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useForum } from './contexts/ForumContext';
import { CreatePostModal } from './components/CreatePostModal';

export function ForumFeed() {
  const navigate = useNavigate();
  const { searchPosts, likePost } = useForum();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPosts = searchPosts(searchQuery).filter(post => 
    activeCategory === 'All' || post.category === activeCategory
  );

  return (
    <AppLayout>
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      <div className="flex flex-col gap-8 pb-20 md:pb-0">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Forum</h1>
            <p className="text-gray-500 dark:text-gray-400">Connect, share, and learn from the community.</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-primary hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ask a Question
          </button>
        </header>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#1a2e22] border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['All', 'Tech', 'Business', 'Career'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-green-500/20'
                    : 'bg-white dark:bg-[#1a2e22] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                   {post.authorImage ? (
                     <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${post.authorImage}')` }}></div>
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center font-bold text-gray-500">
                        {post.author.charAt(0)}
                     </div>
                   )}
                   <div>
                     <h3 className="font-bold text-gray-900 dark:text-white text-sm">{post.author}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
                   </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                   post.category === 'Tech' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                   post.category === 'Business' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                   'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                }`}>
                  {post.category}
                </div>
              </div>

              <h2 
                className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/forum/post/${post.id}`)} // Added onClick for navigation
              >
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{post.content}</p>

              <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-white/5">
                <button 
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium"
                >
                  <ThumbsUp className="w-5 h-5" />
                  {post.likes} Likes
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium">
                  <MessageCircle className="w-5 h-5" />
                  {post.answers} Answers
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium ml-auto">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}

