// menuData.js
export const categories = [
  { id: "all", name: "همه", icon: "🍽️", color: "bg-gray-100" },
  { id: "pizza", name: "پیتزا", icon: "🍕", color: "bg-red-50" },
  { id: "burger", name: "برگر", icon: "🍔", color: "bg-amber-50" },
  { id: "pasta", name: "پاستا", icon: "🍝", color: "bg-blue-50" },
  { id: "salad", name: "سالاد", icon: "🥗", color: "bg-green-50" },
  { id: "drink", name: "نوشیدنی", icon: "🥤", color: "bg-sky-50" },
  { id: "dessert", name: "دسر", icon: "🍰", color: "bg-pink-50" },
];

export const menuItems = [
  {
    id: 1,
    name: "پیتزا مخصوص",
    description: "پپرونی، قارچ، پنیر موزارلا، سس مخصوص رستوران",
    price: 150000,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    rating: 4.8,
  
    prepTime: 25,
    calories: 850,
    ingredients: ["پنیر موزارلا", "پپرونی", "قارچ", "سس گوجه"]
  },
  {
    id: 2,
    name: "برگر کل",
    description: "گوشت گوساله 200گرمی با پنیر چدار و سس مخصوص",
    price: 120000,
    category: "burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    rating: 4.6,
   
    prepTime: 15,
    calories: 720,
    ingredients: ["نان برگر", "گوشت گوساله", "پنیر چدار", "کاهو"]
  },
  {
    id: 3,
    name: "پاستا آلفردو",
    description: "پاستا با سس آلفردو خامه‌ای و قارچ تازه",
    price: 135000,
    category: "pasta",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
    rating: 4.5,
    prepTime: 20,
    calories: 650,
    ingredients: ["پاستا پنه", "سس آلفردو", "قارچ", "پنیر پارمزان"]
  },
  {
    id: 4,
    name: "سالاد سزار",
    description: "سالاد سزار کلاسیک با سس مخصوص و نان کروتون",
    price: 95000,
    category: "salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
    rating: 4.3,
    prepTime: 10,
    calories: 320,
    ingredients: ["کاهو رومی", "سس سزار", "پنیر پارمزان", "کروتون"]
  },
  {
    id: 5,
    name: "نوشابه",
    description: "نوشابه گازدار خنک 330ml",
    price: 35000,
    category: "drink",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7",
    rating: 3.9,
    prepTime: 2,
    calories: 150,
    ingredients: []
  },
  {
    id: 6,
    name: "چیزکیک",
    description: "چیزکیک کلاسیک با توت فرنگی تازه",
    price: 85000,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d",
    rating: 4.7,

    prepTime: 5,
    calories: 480,
    ingredients: ["بیسکویت", "خامه پنیر", "توت فرنگی", "شکر"]
  },
];