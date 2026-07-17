import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: string; // Denormalized name
  authorImage?: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string; // This should be calculated dynamically in a real app, but for now we'll store timestamp
  timestamp: string;
  answers: number; // calculated from comments length usually
  comments: Comment[];
  likes: number;
  likedBy: string[]; // user IDs who liked the post
}

interface ForumContextType {
  posts: Post[];
  searchPosts: (query: string) => Post[];
  createPost: (title: string, content: string, category: string) => void;
  addComment: (postId: string, content: string) => void;
  likePost: (postId: string) => boolean;
  loading: boolean;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'demo1',
    author: 'Alex Morgan',
    title: 'Best practices for scaling React apps?',
    content: 'I am working on a large scale e-commerce application and facing performance issues. What are the key things I should look at?',
    category: 'Tech',
    timeAgo: '2h ago',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    answers: 12,
    comments: [],
    likes: 5,
    likedBy: []
  },
  {
    id: '2',
    authorId: 'demo2',
    author: 'Sarah Chen',
    title: 'How to approach Seed funding?',
    content: 'We have a prototype and some early users. When is the right time to start talking to VCs?',
    category: 'Business',
    timeAgo: '4h ago',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    answers: 8,
    comments: [],
    likes: 15,
    likedBy: []
  },
  {
    id: '3',
    authorId: 'demo3',
    author: 'Dr. Emily Watson',
    title: 'Transitioning from clinical practice to MedTech',
    content: 'Looking for advice on how to leverage my medical background in the tech industry.',
    category: 'Career',
    timeAgo: '1d ago',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    answers: 24,
    comments: [],
    likes: 32,
    likedBy: []
  }
];

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  // Load posts
  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts) as Post[];
      // Backfill likedBy for older stored posts that lack it
      setPosts(parsed.map(p => ({ ...p, likedBy: p.likedBy || [] })));
    } else {
      setPosts(INITIAL_POSTS);
    }
    setLoading(false);
  }, []);

  // Debounced persistence to localStorage (300ms) to avoid thrashing on rapid clicks
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      localStorage.setItem('posts', JSON.stringify(posts));
    }, 300);
    return () => clearTimeout(timer);
  }, [posts, loading]);

  const createPost = (title: string, content: string, category: string) => {
    if (!user) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      authorId: user.id,
      author: user.name,
      authorImage: user.image,
      title,
      content,
      category,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      answers: 0,
      comments: [],
      likes: 0,
      likedBy: []
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name,
      authorImage: user.image || '',
      content,
      timestamp: new Date().toISOString()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Notify post author if not self
        if (post.authorId !== user.id) {
            addNotification(
                post.authorId,
                'reply',
                'New Comment on your Post',
                `${user.name} commented: ${content.substring(0, 50)}...`,
                `/forum`
            );
        }

        return {
          ...post,
          comments: [...post.comments, newComment],
          answers: post.answers + 1
        };
      }
      return post;
    }));
  };

  const likePost = (postId: string): boolean => {
    if (!user) {
      return false;
    }

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = post.likedBy.includes(user.id);
        const likedBy = liked
          ? post.likedBy.filter(id => id !== user.id)
          : [...post.likedBy, user.id];

        return {
          ...post,
          likedBy,
          likes: Math.max(0, post.likes + (liked ? -1 : 1))
        };
      }
      return post;
    }));

    return true;
  };

  const searchPosts = (query: string) => {
    if (!query) return posts;
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) || 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.category.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <ForumContext.Provider value={{ posts, searchPosts, createPost, addComment, likePost, loading }}>
      {children}
    </ForumContext.Provider>
  );
}

export function useForum() {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
}
