import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: <MessageCircle className="feature-icon" />,
      title: 'Real-time Messaging',
      description: 'Instant message delivery with live updates and seamless communication'
    },
    {
      icon: <Users className="feature-icon" />,
      title: 'Group Chats',
      description: 'Create multiple rooms and chat with friends, family, or colleagues'
    },
    {
      icon: <Zap className="feature-icon" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with minimal latency for smooth conversations'
    },
    {
      icon: <Shield className="feature-icon" />,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and protected with modern security'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="home-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <motion.div
        className="home-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.div className="hero-section" variants={itemVariants}>
          <motion.div
            className="logo-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <MessageCircle size={64} />
          </motion.div>
          
          <motion.h1 className="main-title" variants={itemVariants}>
            Welcome to <span className="gradient-text">ChatApp</span>
          </motion.h1>
          
          <motion.p className="subtitle" variants={itemVariants}>
            Connect with friends, collaborate with teams, and communicate in real-time. 
            Experience the future of messaging with our secure and feature-rich platform.
          </motion.p>

          {/* Action Buttons */}
          <motion.div className="action-buttons" variants={itemVariants}>
            <Link to="/login">
              <motion.button
                className="btn btn-primary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            
            <Link to="/register">
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div className="features-section" variants={itemVariants}>
          <motion.h2 className="section-title" variants={itemVariants}>
            Why Choose ChatApp?
          </motion.h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400 }
                }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div className="quick-links-section" variants={itemVariants}>
          <div className="links-container">
            <Link to="/login" className="quick-link">
              <motion.div
                className="link-card"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Users size={24} />
                <span>Existing User</span>
                <p>Sign in to your account</p>
              </motion.div>
            </Link>
            
            <Link to="/register" className="quick-link">
              <motion.div
                className="link-card"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <MessageCircle size={24} />
                <span>New User</span>
                <p>Create your account</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div className="stats-section" variants={itemVariants}>
          <div className="stats-grid">
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                10K+
              </motion.div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: 'spring' }}
              >
                50K+
              </motion.div>
              <div className="stat-label">Messages Daily</div>
            </div>
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                99.9%
              </motion.div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}























// export default function Home() {
//     return (
//         <>
//         <div className="home-page">
//             <div className="home-content">
//                 <div className="title">
//                     <p className="p-title">Chat App</p>
//                 </div>
//                 <div className="hone-links">
//                     <a href="/login">Login</a>
//                     <a href="/reg">Register</a>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// }
