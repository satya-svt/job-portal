import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Heart,
  MessageCircle,
  Edit3,
  Calendar,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  postType: string;
  likes: any[];
  comments: any[];
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  applicants: any[];
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('update');
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, jobsResponse] = await Promise.all([
          axios.get('/posts?limit=10'),
          axios.get('/jobs/user/posted')
        ]);
        
        setPosts(postsResponse.data.posts || []);
        setUserJobs(jobsResponse.data.jobs || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPostLoading(true);
    try {
      const response = await axios.post('/posts', {
        content: newPost,
        postType
      });

      setPosts(prev => [response.data.post, ...prev]);
      setNewPost('');
      setPostType('update');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPostLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await axios.post(`/posts/${postId}/like`);
      
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const userLiked = post.likes.some(like => like.user === user?.id);
          return {
            ...post,
            likes: userLiked 
              ? post.likes.filter(like => like.user !== user?.id)
              : [...post.likes, { user: user?.id }]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'article':
        return '📝';
      case 'question':
        return '❓';
      case 'celebration':
        return '🎉';
      default:
        return '💼';
    }
  };

  const stats = [
    { label: 'Jobs Posted', value: userJobs.length, icon: Briefcase, color: 'blue' },
    { label: 'Total Applications', value: userJobs.reduce((acc, job) => acc + job.applicants.length, 0), icon: Users, color: 'green' },
    { label: 'Posts Created', value: posts.filter(post => post.author._id === user?.id).length, icon: Edit3, color: 'purple' },
    { label: 'Profile Views', value: '142', icon: TrendingUp, color: 'orange' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your professional network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Share an update</h2>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="mb-3 block w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="update">Career Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="article">Article</option>
                    <option value="question">Question</option>
                    <option value="celebration">Celebration</option>
                  </select>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind? Share your professional journey..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {newPost.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={postLoading || !newPost.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {postLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <PlusCircle className="h-4 w-4 mr-2" />
                    )}
                    Share
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {post.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="text-2xl">{getPostTypeIcon(post.postType)}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${post.likes.some(like => like.user === user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-sm">{post.likes.length}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/post-job"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Post a Job
                </Link>
                <Link
                  to="/profile"
                  className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
                <Link
                  to="/jobs"
                  className="w-full bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Link>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Recent Jobs</h3>
                <Link to="/jobs/user/posted" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              {userJobs.length > 0 ? (
                <div className="space-y-4">
                  {userJobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(job.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {job.applicants.length} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No jobs posted yet</p>
                  <Link
                    to="/post-job"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Post your first job
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Profile Strength</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-700 mb-1">
                  <span>Completion</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-sm text-purple-700 mb-4">
                Add more skills and experience to improve your visibility
              </p>
              <Link
                to="/profile"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                Complete Profile
                <Edit3 className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;