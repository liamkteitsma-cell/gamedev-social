import React, { useState, useEffect } from 'react';
import { Search, Home, User, PlusCircle, Heart, MessageCircle, Send, MoreVertical, X, Image, Video, Type, Bell } from 'lucide-react';

export default function GameDevSocial() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newPost, setNewPost] = useState({ type: 'text', title: '', content: '', hashtags: '', media: null, engine: 'General' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', displayName: '' });
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedEngine, setSelectedEngine] = useState('All');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [followingList, setFollowingList] = useState({});
  
  const ADMIN_PASSWORD = 'GameDevAdmin2024'; // Change this to your secret password

  // Initialize with sample data
  useEffect(() => {
    const sampleUsers = [
      { id: 1, username: 'indie_dev_alex', displayName: 'Alex Johnson', bio: 'Indie game developer | Unity & Unreal', avatar: '🎮', followers: 234, following: 156 },
      { id: 2, username: 'pixel_artist_sam', displayName: 'Sam Rivera', bio: 'Pixel artist & game designer', avatar: '🎨', followers: 567, following: 234 },
      { id: 3, username: 'code_wizard', displayName: 'Jamie Chen', bio: 'Game programmer | C++ | Godot', avatar: '⚡', followers: 892, following: 445 }
    ];
    
    const samplePosts = [
      {
        id: 1,
        userId: 2,
        type: 'image',
        title: 'New Character Sprite!',
        content: 'Just finished this character design for my upcoming platformer. What do you think?',
        hashtags: ['pixelart', 'gamedev', 'indiedev'],
        engine: 'Unity',
        media: '🎨',
        likes: 45,
        likedBy: [],
        comments: [],
        timestamp: Date.now() - 3600000
      },
      {
        id: 2,
        userId: 1,
        type: 'video',
        title: 'Gameplay Preview',
        content: 'Working on the combat system for my RPG. Still needs polish but getting there!',
        hashtags: ['gamedev', 'unity', 'rpg'],
        engine: 'Unity',
        media: '🎬',
        likes: 78,
        likedBy: [],
        comments: [],
        timestamp: Date.now() - 7200000
      },
      {
        id: 3,
        userId: 3,
        type: 'text',
        title: 'Optimization Tips',
        content: 'Just published a blog post about optimizing game loops in Godot. Link in bio!',
        hashtags: ['godot', 'programming', 'tutorial'],
        engine: 'Godot',
        media: null,
        likes: 123,
        likedBy: [],
        comments: [],
        timestamp: Date.now() - 10800000
      }
    ];
    
    setUsers(sampleUsers);
    setPosts(samplePosts);
  }, []);

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.displayName) return;
    
    const existingUser = users.find(u => u.username === loginForm.username);
    if (existingUser) {
      setCurrentUser(existingUser);
    } else {
      const newUser = {
        id: users.length + 1,
        username: loginForm.username,
        displayName: loginForm.displayName,
        bio: 'Game developer',
        avatar: '👤',
        followers: 0,
        following: 0
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    }
    setView('feed');
    setLoginForm({ username: '', displayName: '' });
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      alert('Admin mode activated! You can now delete any post.');
    } else {
      alert('Incorrect admin password!');
    }
    setAdminPassword('');
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
  };

  const handleFollow = (userId) => {
    if (!currentUser) return;
    
    const currentFollowing = followingList[currentUser.id] || [];
    const isFollowing = currentFollowing.includes(userId);
    
    if (isFollowing) {
      // Unfollow
      const newFollowing = currentFollowing.filter(id => id !== userId);
      setFollowingList({
        ...followingList,
        [currentUser.id]: newFollowing
      });
      
      // Update both users' counts
      setUsers(users.map(u => {
        if (u.id === userId) return { ...u, followers: Math.max(0, u.followers - 1) };
        if (u.id === currentUser.id) return { ...u, following: Math.max(0, u.following - 1) };
        return u;
      }));
      
      // Update current user object
      setCurrentUser({
        ...currentUser,
        following: Math.max(0, currentUser.following - 1)
      });
    } else {
      // Follow
      const newFollowing = [...currentFollowing, userId];
      setFollowingList({
        ...followingList,
        [currentUser.id]: newFollowing
      });
      
      // Update both users' counts
      setUsers(users.map(u => {
        if (u.id === userId) return { ...u, followers: u.followers + 1 };
        if (u.id === currentUser.id) return { ...u, following: u.following + 1 };
        return u;
      }));
      
      // Update current user object
      setCurrentUser({
        ...currentUser,
        following: currentUser.following + 1
      });
    }
    
    // If viewing the profile, update it too
    if (selectedProfile && selectedProfile.id === userId) {
      setSelectedProfile(users.find(u => u.id === userId));
    }
  };

  const isFollowing = (userId) => {
    if (!currentUser) return false;
    const currentFollowing = followingList[currentUser.id] || [];
    return currentFollowing.includes(userId);
  };

  const getFollowingPosts = () => {
    if (!currentUser) return [];
    const currentFollowing = followingList[currentUser.id] || [];
    return posts.filter(post => currentFollowing.includes(post.userId))
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: posts.length + 1,
      userId: currentUser.id,
      type: newPost.type,
      title: newPost.title,
      content: newPost.content,
      hashtags: newPost.hashtags.split(',').map(tag => tag.trim().replace('#', '')).filter(t => t),
      engine: newPost.engine || 'General',
      media: newPost.media,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: Date.now()
    };

    setPosts([post, ...posts]);
    setNewPost({ type: 'text', title: '', content: '', hashtags: '', media: null, engine: 'General' });
    setShowCreatePost(false);
  };

  const handleLike = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Check if user already liked this post
    if (post.likedBy.includes(currentUser.id)) {
      // Unlike
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: p.likes - 1, likedBy: p.likedBy.filter(id => id !== currentUser.id) }
          : p
      ));
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      // Like
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, currentUser.id] }
          : p
      ));
      setLikedPosts(prev => new Set(prev).add(postId));
    }
  };

  const handleComment = (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    const comment = {
      id: Date.now(),
      userId: currentUser.id,
      text: text.trim(),
      timestamp: Date.now()
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setCommentText({ ...commentText, [postId]: '' });
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPost({ ...newPost, media: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    
    // Filter by engine
    if (selectedEngine !== 'All') {
      filtered = filtered.filter(post => post.engine === selectedEngine);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const user = users.find(u => u.id === post.userId);
        const titleMatch = post.title.toLowerCase().includes(query);
        const usernameMatch = user?.username.toLowerCase().includes(query);
        const hashtagMatch = post.hashtags.some(tag => tag.toLowerCase().includes(query.replace('#', '')));
        return titleMatch || usernameMatch || hashtagMatch;
      });
    }
    
    return filtered;
  };

  const getUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId);
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const renderPost = (post) => {
    const author = users.find(u => u.id === post.userId);
    const isLiked = post.likedBy.includes(currentUser?.id);
    const commentsVisible = showComments[post.id];

    return (
      <div key={post.id} className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setSelectedProfile(author);
              setView('profile');
            }}
          >
            <div className="text-3xl">{author?.avatar}</div>
            <div>
              <div className="font-bold text-white">{author?.displayName}</div>
              <div className="text-sm text-gray-400">@{author?.username} • {formatTime(post.timestamp)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-300 font-semibold">
              {post.engine}
            </span>
            {(isAdmin || post.userId === currentUser?.id) && (
              <button 
                onClick={() => handleDeletePost(post.id)}
                className="text-red-500 hover:text-red-400 font-semibold text-sm px-3 py-1 rounded-lg bg-red-900 bg-opacity-30 hover:bg-opacity-50 transition"
              >
                Delete
              </button>
            )}
            <button className="text-gray-400 hover:text-gray-300">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
          <p className="text-gray-300 mb-3">{post.content}</p>
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {post.media && (
          <div className="bg-gray-950 flex items-center justify-center" style={{ minHeight: '300px' }}>
            {post.type === 'image' && typeof post.media === 'string' && post.media.startsWith('data:') ? (
              <img src={post.media} alt={post.title} className="w-full object-cover" />
            ) : post.type === 'video' && typeof post.media === 'string' && post.media.startsWith('data:') ? (
              <video src={post.media} controls className="w-full" />
            ) : (
              <div className="text-6xl">{post.media}</div>
            )}
          </div>
        )}
        
        <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-6">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 transition ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-semibold">{post.likes}</span>
          </button>
          <button 
            onClick={() => toggleComments(post.id)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
          >
            <MessageCircle size={20} />
            <span className="font-semibold">{post.comments.length}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
            <Send size={20} />
          </button>
        </div>

        {/* Comments Section */}
        {commentsVisible && (
          <div className="border-t border-gray-800 bg-gray-950">
            <div className="p-4 space-y-4">
              {/* Comment Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>

              {/* Comments List */}
              {post.comments.map(comment => {
                const commentAuthor = users.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <div className="text-2xl">{commentAuthor?.avatar}</div>
                    <div className="flex-1 bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{commentAuthor?.displayName}</span>
                        <span className="text-gray-500 text-xs">@{commentAuthor?.username}</span>
                        <span className="text-gray-500 text-xs">• {formatTime(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.text}</p>
                    </div>
                  </div>
                );
              })}

              {post.comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Login Screen
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              GameDev Social
            </h1>
            <p className="text-gray-400">Share your game development journey</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none transition"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={loginForm.displayName}
                onChange={(e) => setLoginForm({ ...loginForm, displayName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none transition"
                placeholder="Your Name"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Join GameDev Social
            </button>

            {/* Admin Login Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <details className="cursor-pointer">
                <summary className="text-sm text-gray-400 hover:text-gray-300 select-none">
                  Admin Login
                </summary>
                <div className="mt-3 space-y-2">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="Admin password"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-red-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleAdminLogin}
                    className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Activate Admin Mode
                  </button>
                </div>
              </details>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            100% Free • No Ads • For Game Developers
          </p>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              GameDev Social
            </span>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search posts, users, or #hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('feed')}
              className={`p-2 rounded-lg ${view === 'feed' ? 'bg-purple-900 text-purple-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <Home size={24} />
            </button>
            <button
              onClick={() => setView('notifications')}
              className={`p-2 rounded-lg relative ${view === 'notifications' ? 'bg-purple-900 text-purple-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <Bell size={24} />
              {getFollowingPosts().length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
            >
              <PlusCircle size={24} />
            </button>
            <button
              onClick={() => {
                setSelectedProfile(currentUser);
                setView('profile');
              }}
              className={`p-2 rounded-lg ${view === 'profile' ? 'bg-purple-900 text-purple-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <User size={24} />
            </button>
            {isAdmin && (
              <span className="text-xs px-3 py-1 rounded-full bg-red-900 text-red-300 font-bold">
                ADMIN MODE
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full my-8">
            <div className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white">Create Post</h2>
              <button onClick={() => setShowCreatePost(false)} className="text-gray-400 hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setNewPost({ ...newPost, type: 'text' })}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold ${newPost.type === 'text' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <Type size={20} className="inline mr-2" />
                  Text
                </button>
                <button
                  onClick={() => setNewPost({ ...newPost, type: 'image' })}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold ${newPost.type === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <Image size={20} className="inline mr-2" />
                  Image
                </button>
                <button
                  onClick={() => setNewPost({ ...newPost, type: 'video' })}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold ${newPost.type === 'video' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <Video size={20} className="inline mr-2" />
                  Video
                </button>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-300">Game Engine</label>
                <select
                  value={newPost.engine}
                  onChange={(e) => setNewPost({ ...newPost, engine: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Unity">Unity</option>
                  <option value="Unreal Engine">Unreal Engine</option>
                  <option value="Godot">Godot</option>
                  <option value="GameMaker">GameMaker</option>
                  <option value="RPG Maker">RPG Maker</option>
                  <option value="Construct">Construct</option>
                  <option value="Custom Engine">Custom Engine</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Post title..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none font-semibold"
              />
              
              <textarea
                placeholder="Share your game development progress..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none min-h-32"
              />
              
              {(newPost.type === 'image' || newPost.type === 'video') && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Upload {newPost.type}
                  </label>
                  <input
                    type="file"
                    accept={newPost.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleMediaUpload}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500"
                  />
                  {newPost.media && (
                    <div className="mt-4 relative">
                      {newPost.type === 'image' ? (
                        <img src={newPost.media} alt="Upload preview" className="w-full rounded-lg max-h-64 object-cover" />
                      ) : (
                        <video 
                          src={newPost.media} 
                          controls 
                          autoPlay={false}
                          loop
                          playsInline
                          className="w-full rounded-lg max-h-64" 
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <input
                type="text"
                placeholder="Hashtags (comma separated, e.g., gamedev, unity, indiedev)"
                value={newPost.hashtags}
                onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-950 text-white focus:border-purple-500 focus:outline-none"
              />
              
              <button
                onClick={handleCreatePost}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === 'feed' && (
          <div>
            {/* Engine Filters */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Filter by Engine</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Unity', 'Unreal Engine', 'Godot', 'GameMaker', 'RPG Maker', 'Construct', 'Custom Engine', 'General', 'Other'].map(engine => (
                  <button
                    key={engine}
                    onClick={() => setSelectedEngine(engine)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      selectedEngine === engine
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {engine}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {filterPosts().map(post => renderPost(post))}
              
              {filterPosts().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No posts found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'profile' && selectedProfile && (
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-start gap-6">
                <div className="text-7xl">{selectedProfile.avatar}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-1 text-white">{selectedProfile.displayName}</h1>
                  <p className="text-gray-400 mb-3">@{selectedProfile.username}</p>
                  <p className="text-gray-300 mb-4">{selectedProfile.bio}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-bold text-white">
                        {users.find(u => u.id === selectedProfile.id)?.followers || selectedProfile.followers}
                      </span>
                      <span className="text-gray-400"> Followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">
                        {users.find(u => u.id === selectedProfile.id)?.following || selectedProfile.following}
                      </span>
                      <span className="text-gray-400"> Following</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">{getUserPosts(selectedProfile.id).length}</span>
                      <span className="text-gray-400"> Posts</span>
                    </div>
                  </div>
                </div>
                {currentUser.id !== selectedProfile.id && (
                  <button 
                    onClick={() => handleFollow(selectedProfile.id)}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      isFollowing(selectedProfile.id)
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90'
                    }`}
                  >
                    {isFollowing(selectedProfile.id) ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-white">Posts</h2>
            <div className="space-y-6">
              {getUserPosts(selectedProfile.id).map(post => renderPost(post))}
              {getUserPosts(selectedProfile.id).length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                  <p className="text-gray-400">No posts yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'notifications' && (
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
              <p className="text-gray-400">Posts from people you follow</p>
            </div>

            {getFollowingPosts().length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Bell size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-bold text-white mb-2">No notifications yet</h3>
                <p className="text-gray-400 mb-4">
                  Follow other game developers to see their posts here
                </p>
                <button
                  onClick={() => setView('feed')}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
                >
                  Explore Feed
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {getFollowingPosts().map(post => renderPost(post))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}