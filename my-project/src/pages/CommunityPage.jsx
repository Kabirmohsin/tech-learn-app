import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'discussion', tags: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // ✅ Fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/posts/all`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    }
    setIsLoading(false);
  }, []);

  // ✅ Fetch members
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/users/members`);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMembers([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'posts') fetchPosts();
    else fetchMembers();
  }, [activeTab, fetchPosts, fetchMembers]);

  // ✅ Image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Create post with image
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !currentUser?._id) return;

    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('author', currentUser.fullName || 'Anonymous');
      formData.append('authorId', currentUser._id);
      formData.append('type', newPost.type);
      formData.append('tags', newPost.tags);
      if (selectedImage) formData.append('image', selectedImage);

      const res = await fetch(`${API}/api/posts/create`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setNewPost({ title: '', content: '', type: 'discussion', tags: '' });
        setSelectedImage(null);
        setImagePreview(null);
        setPostSuccess(true);
        setTimeout(() => setPostSuccess(false), 3000);
        fetchPosts();
      }
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  // ✅ Like / Unlike
  const handleLike = async (postId) => {
    if (!currentUser?._id) return alert('Like karne ke liye login karo!');
    try {
      const res = await fetch(`${API}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add Comment
  const handleComment = async (postId) => {
    const content = commentText[postId];
    if (!content?.trim() || !currentUser?._id) return;

    try {
      const res = await fetch(`${API}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: currentUser.fullName,
          authorId: currentUser._id,
          content,
        }),
      });
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: '' }));
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLikedByMe = (post) => {
    return currentUser?._id && post.likes?.includes(currentUser._id);
  };

  const trendingTopics = [
    { name: "React Hooks",  },
    { name: "Data Science", },
    { name: "Kotlin",  },
    { name: "DevOps",  },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
        <div className="container mx-auto px-6 py-12 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tech Community
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect, collaborate, and grow with developers worldwide.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ===== LEFT SIDEBAR ===== */}
          <div className="lg:col-span-1 space-y-6">

            {/* Create Post Form */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">📝 Create Post</h3>

              {!currentUser?._id && (
                <p className="text-yellow-400 text-sm mb-3">⚠️ Post karne ke liye login karo</p>
              )}
              {postSuccess && (
                <p className="text-green-400 text-sm mb-3">✅ Post successfully create ho gayi!</p>
              )}

              <form onSubmit={handleCreatePost} className="space-y-3">
                {/* Type selector */}
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="discussion" className="bg-slate-800">💬 Discussion</option>
                  <option value="question" className="bg-slate-800">❓ Question</option>
                </select>

                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows="3"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <input
                  type="text"
                  placeholder="Tags (comma separated: react, node)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Image upload */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/10 border border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition-colors">
                    <span>🖼️</span>
                    <span className="text-sm text-gray-300">
                      {selectedImage ? selectedImage.name : 'Please attach your image (optional)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative mt-2">
                      <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >✕</button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!currentUser?._id}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post to Community
                </button>
              </form>
            </div>

            {/* Trending Topics */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">🔥 Trending Topics</h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">📜 Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {["Be respectful and inclusive", "Share knowledge generously", "Help others learn and grow", "Keep discussions professional"].map((g, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>{g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="lg:col-span-2">

            {/* Tabs - sirf 2 */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-2 mb-6">
              <div className="flex space-x-2">
                {[
                  { key: 'posts', label: '📋 Posts' },
                  { key: 'members', label: '👥 Members' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4 animate-pulse">⏳</div>
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : activeTab === 'members' ? (
                /* ===== MEMBERS TAB ===== */
                members.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-gray-400">Koi member nahi mila</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((member) => (
                      <div key={member.id || member._id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold mb-4">
                          {(member.fullName || member.name)?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-semibold">{member.fullName || member.name}</h3>
                        <p className="text-gray-400 text-sm">{member.role}</p>
                        <p className="text-xs text-gray-500 mt-2">Joined: {member.joined}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {member.badges?.map((badge, i) => (
                            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full">{badge}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* ===== POSTS TAB ===== */
                posts.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="text-4xl mb-4">🚀</div>
                    <p className="text-gray-400">Abhi koi post nahi hai. Pehla post banao!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">

                      {/* Post type badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          post.type === 'question'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {post.type === 'question' ? '❓ Question' : '💬 Discussion'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                          {post.author?.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-sm">{post.author}</div>
                      </div>

                      {/* Title + Content */}
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      {post.content && (
                        <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                      )}

                      {/* Image */}
                      {post.image && (
                        <img
                          src={`${API}${post.image}`}
                          alt="post"
                          className="w-full rounded-xl mb-3 max-h-64 object-cover"
                        />
                      )}

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="bg-white/10 px-2 py-1 rounded-full text-xs">#{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Like + Comment count */}
                      <div className="flex items-center gap-4 mb-4 border-t border-white/10 pt-4">
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                            isLikedByMe(post)
                              ? 'text-red-400'
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          {isLikedByMe(post) ? '❤️' : '🤍'} {post.likes?.length || 0} Likes
                        </button>

                        <button
                          onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors font-semibold"
                        >
                          💬 {post.comments?.length || 0} Comments
                        </button>
                      </div>

                      {/* Comments Section - expandable */}
                      {expandedPost === post._id && (
                        <div className="space-y-3">
                          {/* Existing comments */}
                          {post.comments?.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {post.comments.map((comment, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                                      {comment.author?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-semibold">{comment.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300 pl-8">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add comment input */}
                          {currentUser?._id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Comment likho..."
                                value={commentText[post._id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <button
                                onClick={() => handleComment(post._id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                              >
                                Post
                              </button>
                            </div>
                          ) : (
                            <p className="text-yellow-400 text-xs">⚠️ Comment karne ke liye login karo</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-1 space-y-6">

            {/* Logged in user */}
            {currentUser?.fullName && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3">👤 Logged In As</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{currentUser.fullName}</div>
                    <div className="text-xs text-gray-400">{currentUser.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">📅 Upcoming Events</h3>
              <div className="space-y-3">
                {[
                  { name: "React Conference 2024", time: "Tomorrow • 2:00 PM", color: "text-blue-400" },
                  { name: "AI & ML Workshop", time: "Dec 15 • 10:00 AM", color: "text-purple-400" },
                  { name: "Open Source Hackathon", time: "Dec 20 • All Day", color: "text-green-400" },
                ].map((event, i) => (
                  <div key={i} className="p-3 bg-white/10 rounded-xl">
                    <div className={`font-semibold text-sm ${event.color}`}>{event.name}</div>
                    <div className="text-xs text-gray-400">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔍", label: "Search Community" },
                  { icon: "👥", label: "Find Study Partners" },
                  { icon: "🏆", label: "View Leaderboard" },
                ].map((action, i) => (
                  <button key={i} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-left transition-colors flex items-center text-sm">
                    <span className="mr-3">{action.icon}</span>{action.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
