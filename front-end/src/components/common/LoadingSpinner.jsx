import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  centered = true 
}) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  }

  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white'
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const containerClass = `loading-container ${centered ? 'loading-centered' : ''}`
  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`

  return (
    <div className={containerClass}>
      {/* Classic Spinner */}
      <motion.div
        className={spinnerClass}
        variants={spinnerVariants}
        animate="animate"
      >
        <div className="spinner-inner"></div>
      </motion.div>

      {/* Optional Text */}
      {text && <p className="loading-text">{text}</p>}

      {/* Alternative: Dot Loader */}
      {size === 'small' && (
        <motion.div className="dot-loader">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="dot"
              variants={dotVariants}
              animate="animate"
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

// Full Page Loading Component
export const FullPageLoader = ({ message = 'Loading your chat experience...' }) => {
  return (
    <motion.div
      className="full-page-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="loader-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="logo-spinner"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            },
            scale: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <MessageCircle size={48} />
        </motion.div>
        <h3 className="loader-title">ChatApp</h3>
        <LoadingSpinner size="medium" text={message} centered={false} />
      </motion.div>
    </motion.div>
  )
}

// Inline Loading Component
export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="inline-loader">
      <LoadingSpinner size="small" text={text} centered={false} />
    </div>
  )
}

export default LoadingSpinner
