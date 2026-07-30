import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, MessageSquare, User } from "lucide-react";
import { AppLayout } from "./components/AppLayout";
import { useMentors } from "./hooks/useData";
import { useForum } from "./contexts/ForumContext";
import { searchMentors, searchPosts } from "./lib/search";
import { useDebounce } from "./hooks/useDebounce";

const RESULTS_PER_PAGE = 12;

export function GlobalSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"mentors" | "posts">("mentors");
  const [mentorPage, setMentorPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);

  const debouncedQuery = useDebounce(searchQuery, 250);
  const mentors = useMentors();
  const { posts } = useForum();

  // Update URL when search changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
      setMentorPage(1);
      setPostsPage(1);
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  // Search results
  const mentorResults = useMemo(() => {
    if (!debouncedQuery) return [];
    return searchMentors(debouncedQuery, mentors);
  }, [debouncedQuery, mentors]);

  const postResults = useMemo(() => {
    if (!debouncedQuery) return [];
    return searchPosts(debouncedQuery, posts);
  }, [debouncedQuery, posts]);

  // Paginated results
  const paginatedMentors = useMemo(() => {
    const start = (mentorPage - 1) * RESULTS_PER_PAGE;
    return mentorResults.slice(start, start + RESULTS_PER_PAGE);
  }, [mentorResults, mentorPage]);

  const paginatedPosts = useMemo(() => {
    const start = (postsPage - 1) * RESULTS_PER_PAGE;
    return postResults.slice(start, start + RESULTS_PER_PAGE);
  }, [postResults, postsPage]);

  const mentorPages = Math.ceil(mentorResults.length / RESULTS_PER_PAGE);
  const postPages = Math.ceil(postResults.length / RESULTS_PER_PAGE);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 md:p-0 bg-white/80 dark:bg-[#1a2e22]/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none sticky top-0 z-30 md:relative border-b md:border-none border-gray-100 dark:border-white/5 mx-[-16px] md:mx-0 px-6 md:px-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search</h1>
        </header>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentors or forum posts..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {!debouncedQuery ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Start searching
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Find mentors or forum posts to get started.
              </p>
            </div>
          </div>
        ) : mentorResults.length === 0 && postResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No results found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try a different search term.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 dark:border-white/5">
              <button
                onClick={() => setActiveTab("mentors")}
                className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "mentors"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Mentors</span>
                  <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    {mentorResults.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "posts"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Posts</span>
                  <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {postResults.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Mentors Tab */}
            {activeTab === "mentors" && (
              <div className="space-y-6">
                {paginatedMentors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No mentors found matching your search.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginatedMentors.map(({ item: mentor }) => (
                        <button
                          key={mentor.id}
                          onClick={() => navigate(`/mentor/${mentor.id}`)}
                          className="text-left p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-emerald-500/30 transition-all group cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform"
                              style={{ backgroundImage: `url('${mentor.image}')` }}
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {mentor.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {mentor.title || mentor.category}
                              </p>
                            </div>
                          </div>
                          {mentor.about && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                              {mentor.about}
                            </p>
                          )}
                          {mentor.specializations && mentor.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {mentor.specializations.slice(0, 2).map((spec) => (
                                <span
                                  key={spec.name}
                                  className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
                                >
                                  {spec.name}
                                </span>
                              ))}
                              {mentor.specializations.length > 2 && (
                                <span className="text-xs font-medium px-2 py-1 text-gray-500">
                                  +{mentor.specializations.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Pagination */}
                    {mentorPages > 1 && (
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                        <button
                          onClick={() => setMentorPage((p) => Math.max(1, p - 1))}
                          disabled={mentorPage === 1}
                          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Page {mentorPage} of {mentorPages}
                        </span>
                        <button
                          onClick={() => setMentorPage((p) => Math.min(mentorPages, p + 1))}
                          disabled={mentorPage === mentorPages}
                          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {paginatedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No posts found matching your search.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedPosts.map(({ item: post }) => (
                        <button
                          key={post.id}
                          onClick={() => navigate(`/forum/${post.id}`)}
                          className="w-full text-left p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 ring-2 ring-white dark:ring-gray-800"
                              style={{
                                backgroundImage: `url('${
                                  post.authorImage ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`
                                }')`,
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                  {post.title}
                                </h3>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                                  {post.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                                {post.content}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>by {post.author}</span>
                                <span>{post.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Pagination */}
                    {postPages > 1 && (
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                        <button
                          onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                          disabled={postsPage === 1}
                          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Page {postsPage} of {postPages}
                        </span>
                        <button
                          onClick={() => setPostsPage((p) => Math.min(postPages, p + 1))}
                          disabled={postsPage === postPages}
                          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
