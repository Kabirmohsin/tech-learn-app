import { useState, useEffect } from 'react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Sample community data
  const communityData = {
    discussions: [
      {
        id: 1,
        title: "Best practices for React performance optimization",
        author: "Sarah Chen",
        avatar: "👩‍💻",
        timestamp: "2 hours ago",
        likes: 24,
        comments: 8,
        tags: ["react", "performance", "web-dev"]
      },
      {
        id: 2,
        title: "How to get started with Machine Learning?",
        author: "Alex Rodriguez",
        avatar: "👨‍🔬",
        timestamp: "5 hours ago",
        likes: 18,
        comments: 12,
        tags: ["ai-ml", "beginners", "data-science"]
      },
      {
        id: 3,
        title: "Docker vs Kubernetes: Which one to learn first?",
        author: "Mike Thompson",
        avatar: "👨‍💼",
        timestamp: "1 day ago",
        likes: 32,
        comments: 15,
        tags: ["devops", "docker", "kubernetes"]
      }
    ],
    questions: [
      {
        id: 1,
        question: "How to handle state management in large React applications?",
        author: "Priya Sharma",
        avatar: "👩‍🎓",
        timestamp: "3 hours ago",
        answers: 5,
        solved: false,
        tags: ["react", "state-management", "web-dev"]
      },
      {
        id: 2,
        question: "What's the best way to learn Android development in 2024?",
        author: "David Kim",
        avatar: "👨‍💻",
        timestamp: "8 hours ago",
        answers: 3,
        solved: true,
        tags: ["android", "beginners", "mobile"]
      }
    ],
    members: [
      {
        id: 1,
        name: "Emma Wilson",
        role: "Full Stack Developer",
        avatar: "👩‍💼",
        joined: "2 months ago",
        badges: ["🎯 Pro", "🌟 Contributor"],
        skills: ["React", "Node.js", "AWS"]
      },
      {
        id: 2,
        name: "James Brown",
        role: "Data Scientist",
        avatar: "👨‍🔬",
        joined: "1 month ago",
        badges: ["🎯 Pro", "💡 Innovator"],
        skills: ["Python", "ML", "TensorFlow"]
      },
      {
        id: 3,
        name: "Lisa Wang",
        role: "Mobile Developer",
        avatar: "👩‍💻",
        joined: "3 weeks ago",
        badges: ["🚀 Rising Star"],
        skills: ["Android", "Kotlin", "Firebase"]
      }
    ]
  };

 useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (activeTab === "members") {
        const res = await fetch(
          "https://tech-learn-backend-kabir.onrender.com/api/users/members"
        );

        const data = await res.json();
        setPosts(data);
      } else {
        setPosts(communityData[activeTab] || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setPosts([]);
    }

    setIsLoading(false);
  };

  fetchData();
}, [activeTab]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        title: newPost.title,
        author: "You",
        avatar: "😊",
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        tags: ["new"]
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
    }
  };

  const trendingTopics = [
    { name: "React Hooks", posts: 142 },
    { name: "Machine Learning", posts: 98 },
    { name: "Cloud Computing", posts: 76 },
    { name: "DevOps", posts: 64 },
    { name: "Cybersecurity", posts: 53 }
  ];

  const communityStats = {
  totalMembers: "128",
  onlineNow: "14",
  discussions: "53",
  solutions: "27"
};;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tech Community
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect, collaborate, and grow with developers worldwide. Share knowledge, ask questions, and build amazing projects together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-2xl font-bold text-blue-400">{communityStats.totalMembers}</div>
                <div className="text-gray-400 text-sm">Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-2xl font-bold text-green-400">{communityStats.onlineNow}</div>
                <div className="text-gray-400 text-sm">Online Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-2xl font-bold text-purple-400">{communityStats.discussions}</div>
                <div className="text-gray-400 text-sm">Discussions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <div className="text-2xl font-bold text-yellow-400">{communityStats.solutions}</div>
                <div className="text-gray-400 text-sm">Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Post Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Create Post
              </h3>
              <form onSubmit={handleCreatePost}>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows="3"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Post to Community
                </button>
              </form>
            </div>

            {/* Trending Topics */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                      {topic.posts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">📜</span>
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Be respectful and inclusive
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Share knowledge generously
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Help others learn and grow
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Keep discussions professional
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-2 mb-6">
              <div className="flex space-x-2">
                {['discussions', 'questions', 'members'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsLoading(true);
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab === 'discussions' && '💬 Discussions'}
                    {tab === 'questions' && '❓ Q&A'}
                    {tab === 'members' && '👥 Members'}
                  </button>
                ))}
              </div>
            </div>

          {/* Content */}
<div className="space-y-4">

{isLoading ? (

  <p className="text-center text-gray-400">Loading...</p>

) : activeTab === "members" ? (

  /* ===== MEMBERS UI ===== */
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {(posts || []).map((member) => (
      <div
        key={member.id}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl mb-4">
          {member.avatar || member.name?.charAt(0)}
        </div>

        <h3 className="text-lg font-semibold">
          {member.name}
        </h3>

        <p className="text-gray-400 text-sm">
          {member.role}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Joined: {member.joined || "Recently"}
        </p>
      </div>
    ))}

  </div>

) : (

  /* ===== DISCUSSIONS + QUESTIONS ===== */
  (posts || []).map((post) => (
    <div
      key={post.id}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="font-semibold">
        {post.author}
      </div>

      <h3 className="text-xl mb-2">
        {post.title || post.question}
      </h3>

      <div className="flex gap-2 flex-wrap">
        {post.tags?.map((tag, i) => (
          <span key={i} className="bg-white/10 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  ))

)}

</div>
</div>
          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Online Members */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🟢</span>
                Online Now
              </h3>
              <div className="space-y-3">
                {communityData.members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm">
                        {member.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-gray-400">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">📅</span>
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <div className="font-semibold text-blue-400">React Conference 2024</div>
                  <div className="text-sm text-gray-400">Tomorrow • 2:00 PM</div>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <div className="font-semibold text-purple-400">AI & ML Workshop</div>
                  <div className="text-sm text-gray-400">Dec 15 • 10:00 AM</div>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <div className="font-semibold text-green-400">Open Source Hackathon</div>
                  <div className="text-sm text-gray-400">Dec 20 • All Day</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-left transition-colors flex items-center">
                  <span className="mr-3">🔍</span>
                  Search Community
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-left transition-colors flex items-center">
                  <span className="mr-3">👥</span>
                  Find Study Partners
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-left transition-colors flex items-center">
                  <span className="mr-3">🏆</span>
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
