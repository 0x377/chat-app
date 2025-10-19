import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Zap, Shield } from 'lucide-react'

const WelcomeScreen = () => {
  const features = [
    {
      icon: <MessageCircle className="feature-icon" />,
      title: 'Real-time Messaging',
      description: 'Instant message delivery with typing indicators and read receipts'
    },
    {
      icon: <Users className="feature-icon" />,
      title: 'Group Chats',
      description: 'Create public or private rooms and invite multiple users'
    },
    {
      icon: <Zap className="feature-icon" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with smooth animations and quick responses'
    },
    {
      icon: <Shield className="feature-icon" />,
      title: 'Secure & Private',
      description: 'End-to-end encryption and secure authentication'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      className="welcome-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="welcome-container">
        {/* Hero Section */}
        <motion.div
          className="welcome-hero"
          variants={itemVariants}
        >
          <motion.div
            className="hero-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <MessageCircle size={64} />
          </motion.div>
          <h1 className="welcome-title">
            Welcome to <span className="gradient-text">ChatApp</span>
          </h1>
          <p className="welcome-subtitle">
            Connect, collaborate, and communicate with your team in real-time. 
            Start a conversation by selecting a room or create a new one.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="features-grid"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { type: 'spring', stiffness: 400 }
              }}
            >
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="welcome-stats"
          variants={itemVariants}
        >
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Messages</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Availability</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="welcome-cta"
          variants={itemVariants}
        >
          <p className="cta-text">
            Ready to start chatting? Select a room from the sidebar or create a new one!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WelcomeScreen