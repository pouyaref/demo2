import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, EffectCreative } from "swiper/modules";
import {
  FiShoppingCart,
  FiSearch,
  FiStar,
  FiPlus,
  FiMinus,
  FiClock,
  FiChevronLeft,
  FiHeart,
  FiX,
  FiCoffee,
  FiDroplet,
  FiZap,
  FiCheckCircle,
  FiHome,
  FiUser
} from "react-icons/fi";
import { categories, menuItems } from "./data";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-creative";

const MenuPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [orderStep, setOrderStep] = useState("menu"); // 'menu', 'table', 'confirm', 'waiting'
  const [orderId, setOrderId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Expanded categories data with Persian names
  const expandedCategories = [
    { id: "all", name: "همه منو", icon: "✨" },
    { id: "fast-food", name: "فست فود", icon: "🍔" },
    { id: "iranian", name: "ایرانی", icon: "🍲" },
    { id: "kebab", name: "کباب", icon: "🍢" },
    { id: "pizza", name: "پیتزا", icon: "🍕" },
    { id: "sandwich", name: "ساندویچ", icon: "🥪" },
    { id: "salad", name: "سالاد", icon: "🥗" },
    { id: "drinks", name: "نوشیدنی", icon: "🥤" },
    { id: "hot-drinks", name: "نوشیدنی گرم", icon: "☕" },
    { id: "dessert", name: "دسر", icon: "🍰" },
    { id: "cheesecake", name: "چیزکیک", icon: "🧀" },
    { id: "icecream", name: "بستنی", icon: "🍨" },
  ];

  // Track scroll progress for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollY / maxScroll, 1));
      setIsScrolling(true);
      
      const timer = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer effect for waiting page
  useEffect(() => {
    let interval;
    if (orderStep === 'waiting' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [orderStep, timeRemaining]);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "all" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem?.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const deliveryTime = cart.length > 0 ? Math.max(...cart.map((item) => item.prepTime)) + 15 : 0;

  const placeOrder = () => {
    // In a real app, you would send this to your backend
    const newOrderId = Math.floor(Math.random() * 1000000);
    setOrderId(newOrderId);
    setTimeRemaining(deliveryTime * 60); // Convert to seconds
    setOrderStep('waiting');
    setCart([]);
    
    // Play order confirmation sound
    if (typeof Audio !== 'undefined') {
      const audio = new Audio('/order-confirmation.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const dynamicGradient = `linear-gradient(${
    180 + scrollProgress * 20
  }deg, hsl(${45 - scrollProgress * 5} 100% 95%, hsl(${
    30 - scrollProgress * 5
  } 100% 90%)`;

  // Render different screens based on order flow
  if (orderStep === 'table') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 w-full max-w-md border border-white/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiUser size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">انتخاب میز</h2>
            <p className="text-gray-600">لطفاً شماره میز خود را انتخاب نمایید</p>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <motion.button
                  key={num}
                  onClick={() => setTableNumber(num)}
                  className={`p-3 rounded-xl text-lg font-medium transition-all ${
                    tableNumber === num 
                      ? "bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setOrderStep('menu')}
              className="btn btn-ghost flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              بازگشت
            </motion.button>
            <motion.button
              onClick={() => setOrderStep('confirm')}
              className="btn flex-1 bg-gradient-to-r from-amber-500 to-amber-400 border-0 text-white shadow-md hover:shadow-lg disabled:opacity-50 rounded-xl"
              disabled={!tableNumber}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              ادامه
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (orderStep === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 w-full max-w-md border border-white/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiCheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تأیید نهایی سفارش</h2>
            <p className="text-gray-600">لطفاً جزئیات سفارش خود را بررسی کنید</p>
          </div>
          
          <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200/50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700">شماره میز:</span>
              <span className="font-bold text-gray-800">{tableNumber}</span>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200/30">
                  <div className="flex items-center">
                    <span className="text-gray-700">{item.quantity}x</span>
                    <span className="mr-2 text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-800">{(item.price * item.quantity).toLocaleString()} تومان</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200/50 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">جمع کل:</span>
                <span className="font-bold text-gray-800">{cartTotal.toLocaleString()} تومان</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">زمان تحویل:</span>
                <span className="text-gray-600">حدود {deliveryTime} دقیقه</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setOrderStep('table')}
              className="btn btn-ghost flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              بازگشت
            </motion.button>
            <motion.button
              onClick={placeOrder}
              className="btn flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 border-0 text-white shadow-md hover:shadow-lg rounded-xl"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              تأیید و پرداخت
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (orderStep === 'waiting') {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 w-full max-w-md border border-white/30 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <FiClock size={40} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">سفارش شما ثبت شد!</h2>
          <p className="text-gray-600 mb-6">سفارش شما در حال آماده‌سازی است</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200/50">
            <div className="text-sm text-gray-500 mb-2">شماره سفارش</div>
            <div className="text-2xl font-bold text-emerald-600 mb-4">{orderId}</div>
            
            <div className="flex justify-center space-x-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">شماره میز</div>
                <div className="text-lg font-bold text-gray-800">{tableNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">زمان باقیمانده</div>
                <div className="text-lg font-bold text-gray-800">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeRemaining / (deliveryTime * 60)) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          <motion.button
            onClick={() => setOrderStep('menu')}
            className="btn w-full bg-gradient-to-r from-emerald-500 to-emerald-400 border-0 text-white shadow-md hover:shadow-lg rounded-xl"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiHome className="ml-2" />
            بازگشت به منو
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          در صورت هرگونه مشکل با شماره <span className="font-bold">09123456789</span> تماس بگیرید
        </motion.div>
      </div>
    );
  }

  // Main menu screen
  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ background: dynamicGradient }}
    >
      {/* Premium App Header with Glass Morphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/30">
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-300 shadow-md flex items-center justify-center mr-2">
                <FiCoffee className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent tracking-tight">
                کافه رستوران دلپذیر
              </h1>
            </motion.div>
            
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow-lg hover:shadow-amber-200/50 transition-all relative overflow-hidden group"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FiShoppingCart size={20} />
              </button>
              {cartItemCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Animated Search Bar */}
          <motion.div 
            className="mt-3 relative"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی غذا یا نوشیدنی..."
              className="input w-full pr-10 bg-white/90 backdrop-blur-sm border border-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all rounded-xl shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </motion.div>
        </div>
      </header>

      {/* Floating Category Chips with 3D Tilt */}
      <div className="px-4 py-3 max-w-md mx-auto relative z-10">
        <Swiper
          slidesPerView="auto"
          spaceBetween={12}
          freeMode={true}
          mousewheel={true}
          modules={[FreeMode, Mousewheel, EffectCreative]}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: false,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          className="category-swiper"
        >
          {expandedCategories.map((cat) => (
            <SwiperSlide key={cat.id} style={{ width: 'auto' }}>
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow-md"
                    : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-sm"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="ml-2">{cat.icon}</span>
                {cat.name}
              </motion.button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Menu Items with Staggered Animation */}
      <main className="p-4 max-w-md mx-auto pb-24">
        <LayoutGroup>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-500"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center shadow-inner">
                <FiSearch size={32} className="opacity-30" />
              </div>
              <p className="text-gray-600 mb-2">هیچ موردی یافت نشد</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn btn-ghost mt-4 text-amber-600 hover:bg-amber-50 rounded-xl"
              >
                پاک کردن فیلترها
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    layout: { duration: 0.3 }
                  }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-white/30 cursor-pointer relative group"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Premium Badges */}
                  {item.isPopular && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-md">
                        پرفروش
                      </span>
                    </div>
                  )}
                  {item.isNew && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md">
                        جدید
                      </span>
                    </div>
                  )}

                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-3 left-3 p-2 bg-white/80 rounded-xl backdrop-blur-sm shadow-sm hover:bg-white transition-all z-10"
                    >
                      <FiHeart
                        size={18}
                        className={
                          favorites.includes(item.id)
                            ? "text-red-500 fill-red-500 animate-pulse"
                            : "text-gray-700"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-bold text-gray-800 text-lg">{item.name}</h2>
                      <span className="text-amber-600 font-bold whitespace-nowrap">
                        {item.price.toLocaleString()} تومان
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm space-x-3">
                        <div className="flex items-center">
                          <FiClock size={14} className="ml-1" />
                          <span>{item.prepTime} دقیقه</span>
                        </div>
                        <div className="flex items-center">
                          <FiStar
                            size={14}
                            className="text-amber-400 ml-1 fill-amber-400"
                          />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="p-2 bg-gradient-to-br from-amber-500 to-amber-400 text-white rounded-xl shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiPlus size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </LayoutGroup>
      </main>

      {/* Premium Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.5
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl h-[90vh] overflow-hidden border border-white/30"
            >
              <div className="absolute top-4 left-4 z-10">
                <motion.button
                  onClick={() => setSelectedItem(null)}
                  className="btn btn-circle btn-ghost bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white rounded-xl"
                  whileHover={{ rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiChevronLeft size={20} />
                </motion.button>
              </div>

              <div className="h-full flex flex-col">
                {/* Hero Image with Parallax */}
                <div className="h-64 w-full relative overflow-hidden">
                  <motion.img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedItem.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-xl backdrop-blur-sm shadow-sm hover:bg-white transition-all z-10"
                  >
                    <FiHeart
                      size={20}
                      className={
                        favorites.includes(selectedItem.id)
                          ? "text-red-500 fill-red-500 animate-pulse"
                          : "text-gray-700"
                      }
                    />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  <motion.div 
                    className="flex justify-between items-start mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedItem.name}
                    </h2>
                    <span className="text-xl font-bold text-amber-600">
                      {selectedItem.price.toLocaleString()} تومان
                    </span>
                  </motion.div>

                  <motion.div 
                    className="flex items-center text-gray-500 mb-6 space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center">
                      <FiClock size={16} className="ml-1" />
                      <span>{selectedItem.prepTime} دقیقه</span>
                    </div>
                    <div className="flex items-center">
                      <FiStar
                        size={16}
                        className="text-amber-400 ml-1 fill-amber-400"
                      />
                      <span className="text-sm mr-1">
                        {selectedItem.rating.toFixed(1)}
                      </span>
                    </div>
                    {selectedItem.isVegetarian && (
                      <div className="flex items-center">
                        <FiDroplet size={16} className="ml-1 text-emerald-500" />
                        <span className="text-sm text-emerald-600">گیاهی</span>
                      </div>
                    )}
                    {selectedItem.isSpicy && (
                      <div className="flex items-center">
                        <FiZap size={16} className="ml-1 text-red-500" />
                        <span className="text-sm text-red-600">تند</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.p 
                    className="text-gray-700 mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedItem.description}
                  </motion.p>

                  {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="font-bold mb-3 text-gray-800">
                        مواد تشکیل دهنده:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.ingredients.map((ing, i) => (
                          <motion.span
                            key={i}
                            className="badge bg-gray-100 border border-gray-200/50 text-gray-700 hover:bg-white transition-all rounded-xl"
                            whileHover={{ y: -2 }}
                          >
                            {ing}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div 
                    className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl mb-6 border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-gray-700">میزان کالری:</span>
                    <span className="font-bold text-gray-800">
                      {selectedItem.calories} کیلوکالری
                    </span>
                  </motion.div>
                </div>

                <motion.div 
                  className="p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="btn w-full bg-gradient-to-r from-amber-500 to-amber-400 border-0 text-white shadow-lg hover:shadow-xl relative overflow-hidden group rounded-xl"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">افزودن به سبد خرید</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Luxury Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.5
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl h-[85vh] overflow-hidden border border-white/30"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <motion.h2 
                    className="text-xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    سبد خرید شما
                  </motion.h2>
                  <motion.button
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-ghost btn-circle text-gray-700 hover:bg-gray-100 rounded-xl"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>

                {cart.length === 0 ? (
                  <motion.div 
                    className="flex-1 flex flex-col items-center justify-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center shadow-inner mb-6">
                      <FiShoppingCart size={36} className="opacity-30" />
                    </div>
                    <p className="mb-2 text-gray-600">سبد خرید شما خالی است</p>
                    <motion.button
                      onClick={() => setIsCartOpen(false)}
                      className="btn btn-ghost text-amber-600 hover:bg-amber-50 rounded-xl"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      بازگشت به منو
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div 
                      className="flex-1 overflow-y-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <LayoutGroup>
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-xl border border-gray-200/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <div className="flex items-center">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="mr-3">
                                <h3 className="font-medium text-gray-800">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {(item.price * item.quantity).toLocaleString()} تومان
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <motion.button
                                onClick={() => removeFromCart(item.id)}
                                className="btn btn-ghost btn-sm text-gray-500 hover:text-red-500 rounded-xl"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiMinus size={16} />
                              </motion.button>
                              <span className="mx-2 font-medium text-gray-700">
                                {item.quantity}
                              </span>
                              <motion.button
                                onClick={() => addToCart(item)}
                                className="btn btn-ghost btn-sm text-gray-500 hover:text-green-500 rounded-xl"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiPlus size={16} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </LayoutGroup>
                    </motion.div>

                    <motion.div 
                      className="border-t border-gray-200/50 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700">جمع کل:</span>
                        <span className="font-bold text-gray-800">
                          {cartTotal.toLocaleString()} تومان
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-gray-500">زمان تحویل:</span>
                        <span className="text-gray-600">
                          حدود {deliveryTime} دقیقه
                        </span>
                      </div>
                      <motion.button
                        onClick={() => {
                          setIsCartOpen(false);
                          setOrderStep('table');
                        }}
                        className="btn w-full bg-gradient-to-r from-amber-500 to-amber-400 border-0 text-white shadow-lg hover:shadow-xl rounded-xl"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10">ادامه فرآیند خرید</span>
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;