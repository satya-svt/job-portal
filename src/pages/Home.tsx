import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, TrendingUp, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

const stats = [
  {
    icon: <Briefcase className="h-10 w-10 text-indigo-400" />,
    value: '10,000+',
    label: 'Active Jobs',
    color: 'from-indigo-500 to-indigo-700'
  },
  {
    icon: <Users className="h-10 w-10 text-pink-400" />,
    value: '50,000+',
    label: 'Professionals',
    color: 'from-pink-500 to-pink-700'
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
    value: '95%',
    label: 'Success Rate',
    color: 'from-emerald-500 to-emerald-700'
  }
];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Glowing animation style */}
      <style>
        {`
          .glow-animate {
            box-shadow: 0 0 16px 2px rgba(236, 72, 153, 0.5), 0 0 32px 4px rgba(99, 102, 241, 0.3);
            transition: box-shadow 0.3s, transform 0.2s;
            position: relative;
            z-index: 1;
          }
          .glow-animate:hover, .glow-animate:focus {
            box-shadow: 0 0 32px 8px rgba(236, 72, 153, 0.8), 0 0 64px 16px rgba(99, 102, 241, 0.5);
            transform: scale(1.04);
          }
        `}
      </style>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-lg"
            >
              Empower Your <span className="text-indigo-200">Career</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                Connect. Collaborate. Succeed.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-2xl md:text-2xl mb-10 text-indigo-100 leading-relaxed"
            >
              Join a vibrant community of professionals and discover your next big opportunity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="glow-animate bg-gradient-to-r from-pink-400 to-indigo-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/jobs"
                    className="glow-animate border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-indigo-700 transition-colors inline-flex items-center justify-center"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="glow-animate bg-gradient-to-r from-pink-400 to-indigo-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center justify-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/post-job"
                    className="glow-animate border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-indigo-700 transition-colors inline-flex items-center justify-center"
                  >
                    Post a Job
                  </Link>
                </>
              )}
            </motion.div>
          </div>
          {/* Animated Blobs */}
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl z-0"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl z-0"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.7 }}
              className={`rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg p-8 text-center`}
            >
              <div className="flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-extrabold mb-2 drop-shadow">{stat.value}</div>
              <div className="text-indigo-100 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gradient-to-br from-white via-indigo-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
              Discover exciting career opportunities from top companies
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-indigo-100 rounded-2xl p-8 animate-pulse shadow">
                  <div className="h-8 bg-indigo-200 rounded mb-4"></div>
                  <div className="h-5 bg-indigo-200 rounded mb-2"></div>
                  <div className="h-5 bg-indigo-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-7 bg-indigo-200 rounded-full w-20"></div>
                    <div className="h-7 bg-indigo-200 rounded-full w-24"></div>
                  </div>
                  <div className="h-5 bg-indigo-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {featuredJobs.map((job, idx) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white border border-indigo-100 rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <p className="text-indigo-600 font-medium">{job.company}</p>
                    </div>
                    <Star className="h-6 w-6 text-yellow-400 fill-current drop-shadow" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-indigo-500">📍 {job.location}</p>
                    <p className="text-sm text-indigo-500">💰 {formatSalary(job.budget.min, job.budget.max, job.budget.currency)}</p>
                    <p className="text-sm text-indigo-500">⏰ {job.jobType}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-xs text-indigo-400">+{job.requiredSkills.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-400">{formatDate(job.createdAt)}</span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-sm inline-flex items-center"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  {/* Animated gradient border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/jobs"
              className="glow-animate bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center"
            >
              View All Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
              Community Updates
            </h2>
            <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
              Stay connected with the latest from our professional community
            </p>
          </div>
          {loading ? (
            <div className="space-y-8 max-w-2xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-indigo-100 rounded-2xl p-8 animate-pulse shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-indigo-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-5 bg-indigo-200 rounded w-28 mb-1"></div>
                      <div className="h-4 bg-indigo-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-indigo-200 rounded"></div>
                    <div className="h-5 bg-indigo-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="space-y-8 max-w-2xl mx-auto mb-12"
            >
              {recentPosts.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 border border-indigo-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 shadow">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">{post.author.name}</h4>
                      <p className="text-sm text-indigo-400">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-indigo-800 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-indigo-400">
                    <span>❤️ {post.likes.length} likes</span>
                    <span>💬 {post.comments.length} comments</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          {user && (
            <div className="text-center">
              <Link
                to="/dashboard"
                className="glow-animate bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center"
              >
                Join the Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Ready to Take Your Career to the Next Level?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl mb-8 text-indigo-100"
          >
            Join our community of professionals and discover unlimited opportunities
          </motion.p>
          {!user ? (
            <Link
              to="/register"
              className="glow-animate bg-white text-pink-600 px-10 py-4 rounded-xl font-bold hover:bg-pink-50 transition-colors inline-flex items-center"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="glow-animate bg-white text-pink-600 px-10 py-4 rounded-xl font-bold hover:bg-pink-50 transition-colors inline-flex items-center"
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