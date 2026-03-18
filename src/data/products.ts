export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  condition: string;
  image: string;
  description: string;
  brand?: string;
  powerRating?: string;
  size?: string;
  featured?: boolean;
}

export const sampleProducts: Product[] = [
  { id: 1, name: 'Samsung 32" LED TV', price: 4500, category: "electronics", condition: "Good", image: "📺", description: "Samsung 32-inch LED TV in excellent working condition. Crystal clear display, remote included. Perfect for bedroom or small living room.", brand: "Samsung", powerRating: "60W", featured: true },
  { id: 2, name: "Wooden Study Table", price: 1200, category: "furniture", condition: "Fair", image: "🪑", description: "Solid wooden study table with drawer. Minor scratches but structurally sturdy. Great for students.", brand: "Local Carpenter", featured: true },
  { id: 3, name: "Levi's Denim Jacket", price: 800, category: "clothes", condition: "Like New", image: "🧥", description: "Original Levi's denim jacket, worn only twice. Size M. Looks brand new with tags intact.", brand: "Levi's", size: "M", featured: true },
  { id: 4, name: "Geometry Box Set", price: 150, category: "stationery", condition: "Good", image: "📐", description: "Complete geometry box with compass, protractor, set squares, and divider. Ideal for school students." },
  { id: 5, name: "Ceiling Fan - Havells", price: 600, category: "electronics", condition: "Working", image: "🌀", description: "Havells 1200mm ceiling fan. Runs smoothly, energy efficient. Includes all mounting hardware.", brand: "Havells", powerRating: "75W", featured: true },
  { id: 6, name: "Queen Size Bed Frame", price: 3500, category: "furniture", condition: "Good", image: "🛏️", description: "Teak wood queen size bed frame. Strong and elegant design. Mattress not included. Minor wear on legs.", brand: "Godrej Interio", featured: true },
  { id: 7, name: "Nike Running Shoes (Size 9)", price: 1000, category: "clothes", condition: "Lightly Used", image: "👟", description: "Nike Air Zoom Pegasus running shoes, UK Size 9. Used for 2 months only. Excellent grip and comfort.", brand: "Nike", size: "UK 9", featured: true },
  { id: 8, name: "Kitchen Utensils Set", price: 350, category: "other", condition: "Good", image: "🍳", description: "12-piece stainless steel kitchen utensils set. Includes ladle, spatula, tongs, and more. Barely used." },
  { id: 9, name: "Bajaj Desert Cooler", price: 2800, category: "electronics", condition: "Good", image: "❄️", description: "Bajaj 67L desert air cooler with honeycomb pads. Powerful air throw, ideal for large rooms.", brand: "Bajaj", powerRating: "185W" },
  { id: 10, name: "Office Swivel Chair", price: 1800, category: "furniture", condition: "Good", image: "💺", description: "Ergonomic office chair with lumbar support, adjustable height, and armrests. Cushion in great shape.", brand: "IKEA" },
];
