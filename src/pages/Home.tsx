import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, TrendingUp, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  postType: string;
  likes: any[];
  comments: any[];
  createdAt: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, postsResponse] = await Promise.all([
          axios.get('/jobs?limit=6'),
          axios.get('/posts?limit=5')
        ]);
        
        setFeaturedJobs(jobsResponse.data.jobs || []);
        setRecentPosts(postsResponse.data.posts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatSalary = (min: number, max: number, currency: string = 'USD') => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connect, Collaborate, and 
              <span className="text-blue-200 block">Advance Your Career</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Join thousands of professionals finding their next opportunity and building meaningful connections
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/post-job"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Post a Job
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Briefcase className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Professionals</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exciting career opportunities from top companies
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredJobs.map((job) => (
                <div key={job._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">📍 {job.location}</p>
                    <p className="text-sm text-gray-500">💰 {formatSalary(job.budget.min, job.budget.max, job.budget.currency)}</p>
                    <p className="text-sm text-gray-500">⏰ {job.jobType}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-xs text-gray-500">+{job.requiredSkills.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Community Updates
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay connected with the latest from our professional community
            </p>
          </div>

          {loading ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto mb-12">
              {recentPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>❤️ {post.likes.length} likes</span>
                    <span>💬 {post.comments.length} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user && (
            <div className="text-center">
              <Link
                to="/dashboard"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
              >
                Join the Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join our community of professionals and discover unlimited opportunities
          </p>
          {!user ? (
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
            >
              Complete Your Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;