import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, Building2, MessageSquare, ArrowRight, CheckCircle2, Share2, TrendingUp, Send, ThumbsUp, ThumbsDown, User, Globe, ArrowUpRight, ArrowDownRight, MessageCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const reviews = {
  positive: [
    { id: 1, rating: 5, text: "Amazing service! The staff went above and beyond!", emoji: "😊", customerName: "Sarah M." },
    { id: 2, rating: 5, text: "Best dining experience ever! Will definitely return!", emoji: "🤩", customerName: "John D." },
    { id: 3, rating: 5, text: "Outstanding food and impeccable service!", emoji: "😍", customerName: "Mike R." }
  ],
  negative: [
    { id: 4, rating: 2, text: "Service was slow today", emoji: "😕", customerName: "Alex P.", 
      recoveryText: "Thank you for the thoughtful gift! Service was much better this time!" },
    { id: 5, rating: 1, text: "Food wasn't up to usual standards", emoji: "😞", customerName: "Chris L.",
      recoveryText: "The manager's response was great! Much improved experience!" }
  ]
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const ReviewBubble = ({ review, onAnimationComplete, position, isFloating = false, isRecovered = false, showGift = false, isPublic = false, managerResponse = null }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, ...position }}
      animate={{ 
        scale: 1,
        opacity: 1,
        y: isFloating ? [position.y, position.y - 15, position.y] : position.y,
        x: position.x
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.5,
        y: isFloating ? { 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined
      }}
      onAnimationComplete={onAnimationComplete}
      className={`absolute ${
        isRecovered ? 'bg-green-50 border-2 border-green-200' : 
        (review.rating >= 4 ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200')
      } p-4 rounded-2xl shadow-lg backdrop-blur-sm z-10 max-w-xs cursor-pointer transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-start gap-3 relative">
        {showGift && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -top-2 -right-2 bg-purple-100 p-1.5 rounded-full shadow-md"
          >
            <Gift className="w-4 h-4 text-purple-600" />
          </motion.div>
        )}
        {isPublic && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -top-2 -left-2 bg-blue-100 p-1.5 rounded-full shadow-md"
          >
            <Globe className="w-4 h-4 text-blue-600" />
          </motion.div>
        )}
        <span className="text-2xl filter drop-shadow-sm">{isRecovered ? "😊" : review.emoji}</span>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(isRecovered ? 5 : review.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
              </motion.div>
            ))}
          </div>
          <p className={`text-sm ${
            isRecovered ? 'text-green-700' : 
            (review.rating >= 4 ? 'text-green-700' : 'text-orange-700')
          } font-medium leading-snug`}>
            {isRecovered ? review.recoveryText : review.text}
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">{review.customerName}</p>
          {managerResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 bg-white/70 p-2.5 rounded-lg border border-blue-100"
            >
              <p className="text-xs text-blue-700 leading-snug">
                <span className="font-medium">Manager Response:</span> {managerResponse}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const GoogleReviewIndicator = ({ animate = false }) => (
  <motion.div
    {...fadeInScale}
    className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg shadow-lg border-2 border-blue-100"
  >
    <div className="flex flex-col items-center">
      <span className="text-blue-500 font-bold text-lg">G</span>
      <div className="flex space-x-0.5">
        {['red', 'yellow', 'green', 'blue'].map((color, i) => (
          <motion.span
            key={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`text-${color}-500 text-xs`}
          >
            ●
          </motion.span>
        ))}
      </div>
    </div>
    <span className="text-gray-700 text-sm font-medium">Google Review</span>
    {animate && (
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-2"
      >
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      </motion.div>
    )}
  </motion.div>
);

const ManagerPortal = ({ onGiftClick }) => {
  const [isGiftFlying, setIsGiftFlying] = useState(false);

  const handleGiftClick = () => {
    setIsGiftFlying(true);
    setTimeout(() => {
      setIsGiftFlying(false);
      onGiftClick();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="absolute bottom-8 left-[25%] transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="bg-blue-50 p-2 rounded-full"
        >
          <User className="w-8 h-8 text-blue-600" />
        </motion.div>
        <span className="text-sm font-medium text-gray-700">Manager Portal</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGiftClick}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-200 transition-colors shadow-sm"
        >
          <Gift className="w-5 h-5" />
          Send Recovery Gift
        </motion.button>
        {isGiftFlying && (
          <motion.div
            initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{ 
              x: 200, 
              y: -100, 
              scale: 1.2,
              rotate: 360
            }}
            transition={{ 
              duration: 1, 
              ease: "easeInOut",
              rotate: { duration: 1.5 }
            }}
            className="absolute z-20"
          >
            <Gift className="w-6 h-6 text-purple-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ReviewManagementFlow = () => {
  const [phase, setPhase] = useState(0);
  const [averageRating, setAverageRating] = useState(3.2);
  const [totalReviews, setTotalReviews] = useState(45);
  const [chartData, setChartData] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [showManagerPortal, setShowManagerPortal] = useState(false);
  const [showRecoveredReview, setShowRecoveredReview] = useState(false);
  const [showGoogleFlow, setShowGoogleFlow] = useState(false);
  const [isPositiveFlow, setIsPositiveFlow] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [managerResponse, setManagerResponse] = useState(null);

  useEffect(() => {
    setChartData(Array.from({ length: 8 }, (_, i) => ({
      value: 3.2 + (i * 0.1),
      timestamp: i
    })));

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setPhase(1);
      
      await new Promise(r => setTimeout(r, 500));
      setCurrentReview(reviews.negative[0]);
      await new Promise(r => setTimeout(r, 2000));
      setShowManagerPortal(true);

      setTimeout(async () => {
        setCurrentReview(null);
        setShowManagerPortal(false);
        setShowRecoveredReview(false);
        setShowGoogleFlow(false);
        setShowGift(false);
        setManagerResponse(null);
        
        await new Promise(r => setTimeout(r, 1000));
        setIsPositiveFlow(true);
        setCurrentReview(reviews.positive[0]);
        await new Promise(r => setTimeout(r, 1000));
        setShowGift(true);
        await new Promise(r => setTimeout(r, 1000));
        setShowGoogleFlow(true);
        
        setAverageRating(prev => prev + 0.3);
        setTotalReviews(prev => prev + 1);
        setChartData(prev => [...prev.slice(1), { value: prev[prev.length - 1].value + 0.3, timestamp: prev.length }]);
      }, 12000);
    };

    sequence();
  }, []);

  const handleGiftClick = async () => {
    setShowManagerPortal(false);
    setShowGift(true);
    await new Promise(r => setTimeout(r, 500));

    setManagerResponse("We're sorry about your experience. Please accept this small gift as a token of our commitment to making things right.");
    await new Promise(r => setTimeout(r, 2000));

    setShowRecoveredReview(true);
    await new Promise(r => setTimeout(r, 2000));

    setShowGoogleFlow(true);
    
    setAverageRating(prev => prev + 0.2);
    setTotalReviews(prev => prev + 1);
    setChartData(prev => [...prev.slice(1), { value: prev[prev.length - 1].value + 0.2, timestamp: prev.length }]);
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 w-full max-w-xl border border-blue-100">
      {/* Header Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <motion.div 
          className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-sm text-gray-600 font-medium">Rating</div>
          <div className="flex items-center gap-1">
            <motion.span 
              className="text-2xl font-bold text-blue-600"
              key={averageRating}
              animate={{ scale: [1, 1.1, 1] }}
            >
              {averageRating.toFixed(1)}
            </motion.span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-sm text-gray-600 font-medium">Reviews</div>
          <div className="flex items-center gap-1">
            <motion.span 
              className="text-2xl font-bold text-blue-600"
              key={totalReviews}
              animate={{ scale: [1, 1.1, 1] }}
            >
              {totalReviews}
            </motion.span>
            <Share2 className="w-5 h-5 text-blue-500" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-sm text-gray-600 font-medium">Trend</div>
          <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                />
                <YAxis hide domain={[3, 5]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Animation Area */}
      <div className="relative h-96 bg-white/40 rounded-lg backdrop-blur-sm border border-blue-50">
        <AnimatePresence mode="wait">
          {phase === 0 ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div className="text-center mb-8">
                <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Turn Every Review into an Opportunity
                </h3>
              </motion.div>
              
              <div className="flex gap-16 mt-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-orange-50 p-4 rounded-xl mb-4 shadow-sm">
                    <ThumbsDown className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex items-center text-orange-600 mb-2">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Internal Review</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    <Gift className="w-6 h-6 text-purple-600" />
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-green-50 p-4 rounded-xl mb-4 shadow-sm">
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center text-green-600 mb-2">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Google Review</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <Gift className="w-6 h-6 text-purple-600" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <div className="flex justify-center relative h-full">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-8"
                >
                  <Building2 className="w-12 h-12 text-blue-600" />
                </motion.div>

                <AnimatePresence>
                  {currentReview && !showRecoveredReview && !isPositiveFlow && (
                    <ReviewBubble
                      review={currentReview}
                      position={{ x: 0, y: 100 }}
                      isFloating={!showManagerPortal}
                      showGift={showGift}
                      isPublic={false}
                      managerResponse={managerResponse}
                    />
                  )}
                  
                  {showRecoveredReview && (
                    <ReviewBubble
                      review={currentReview}
                      position={{ x: 200, y: 100 }}
                      isFloating={true}
                      isRecovered={true}
                      showGift={true}
                    />
                  )}

                  {isPositiveFlow && !showGoogleFlow && (
                    <ReviewBubble
                      review={currentReview}
                      position={{ x: 0, y: 100 }}
                      isFloating={true}
                      showGift={showGift}
                      isPublic={true}
                    />
                  )}

                  {isPositiveFlow && showGoogleFlow && (
                    <ReviewBubble
                      review={currentReview}
                      position={{ x: 200, y: 100 }}
                      isFloating={true}
                      isPublic={true}
                      showGift={true}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showManagerPortal && (
                    <ManagerPortal onGiftClick={handleGiftClick} />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showGoogleFlow && (
                    <motion.div
                      initial={{ opacity: 0, x: 200 }}
                      animate={{ opacity: 1, x: 250 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 transform -translate-y-1/2"
                    >
                      <GoogleReviewIndicator animate={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 text-center bg-white/80 px-4 py-2 rounded-full shadow-sm border border-blue-100"
          >
            {!showManagerPortal && !showRecoveredReview && !isPositiveFlow && "New feedback received..."}
            {showManagerPortal && "Routing to manager for recovery..."}
            {showRecoveredReview && !showGoogleFlow && "Customer received recovery gift!"}
            {showGoogleFlow && !isPositiveFlow && "Converting to positive review..."}
            {isPositiveFlow && !showGoogleFlow && "5-star review received!"}
            {isPositiveFlow && showGift && !showGoogleFlow && "Sending appreciation gift..."}
            {isPositiveFlow && showGoogleFlow && "Publishing to Google Reviews..."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewManagementFlow;