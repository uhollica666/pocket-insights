export interface Transaction {
  id: string;
  amount: number;
  date: Date;
}

export interface IncomeRecord extends Transaction {
  source: string;
}

export interface ExpenseRecord extends Transaction {
  category: ExpenseCategory;
  description: string;
}

export type ExpenseCategory =
  | 'Bathroom and Toilet Supplies'
  | 'Books and Study Materials'
  | 'Business Travel'
  | 'Cable or TV Subscription'
  | 'Car Insurance'
  | 'Charity Donations'
  | 'Childcare Services'
  | 'Clothing'
  | 'Coffee, Snacks, and Drinks'
  | 'Concerts and Events'
  | 'Dining Out'
  | 'Electronics'
  | 'Emergency Fund'
  | 'Entertainment Subscriptions'
  | 'Fines and Penalties'
  | 'Flight Tickets'
  | 'Food Delivery'
  | 'Fuel'
  | 'Gifts'
  | 'Groceries'
  | 'Gym and Fitness'
  | 'Haircuts and Salon'
  | 'Health Insurance'
  | 'Hobbies and Crafts'
  | 'Home Cleaning Supplies'
  | 'Home Decor and Furnishings'
  | 'Hotel Stays'
  | 'Household Supplies'
  | 'Income Taxes'
  | 'Internet'
  | "Kids' Supplies"
  | 'Laundry and Dry Cleaning'
  | 'Loan Payments'
  | 'Medical and Health Supplies'
  | 'Movies and Shows'
  | 'Online Courses and Learning Platforms'
  | 'Others'
  | 'Parking Fees'
  | 'Pet Food'
  | 'Pet Toys and Accessories'
  | 'Pharmacy and Medication'
  | 'Professional Services'
  | 'Public Transport'
  | 'Religious Offerings'
  | 'Rent'
  | 'Repairs and Maintenance'
  | 'School Fees'
  | 'Skincare and Grooming'
  | 'Software Subscriptions'
  | 'Souvenirs'
  | 'Streaming Subscriptions'
  | 'Taxi and Ride-Sharing'
  | 'Toys and Activities'
  | 'Unplanned Expenses'
  | 'Utilities – Electricity'
  | 'Utilities – Gas'
  | 'Vehicle Maintenance'
  | 'Vegetables'
  | 'Video Games'
  // Keeping original general categories for broader icon mapping if needed, but new list takes precedence
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Health'
  | 'Shopping';

export const expenseCategories: ExpenseCategory[] = [
  'Bathroom and Toilet Supplies',
  'Books and Study Materials',
  'Business Travel',
  'Cable or TV Subscription',
  'Car Insurance',
  'Charity Donations',
  'Childcare Services',
  'Clothing',
  'Coffee, Snacks, and Drinks',
  'Concerts and Events',
  'Dining Out',
  'Electronics',
  'Emergency Fund',
  'Entertainment Subscriptions',
  'Fines and Penalties',
  'Flight Tickets',
  'Food Delivery',
  'Fuel',
  'Gifts',
  'Groceries',
  'Gym and Fitness',
  'Haircuts and Salon',
  'Health Insurance',
  'Hobbies and Crafts',
  'Home Cleaning Supplies',
  'Home Decor and Furnishings',
  'Hotel Stays',
  'Household Supplies',
  'Income Taxes',
  'Internet',
  "Kids' Supplies",
  'Laundry and Dry Cleaning',
  'Loan Payments',
  'Medical and Health Supplies',
  'Movies and Shows',
  'Online Courses and Learning Platforms',
  'Others',
  'Parking Fees',
  'Pet Food',
  'Pet Toys and Accessories',
  'Pharmacy and Medication',
  'Professional Services',
  'Public Transport',
  'Religious Offerings',
  'Rent',
  'Repairs and Maintenance',
  'School Fees',
  'Skincare and Grooming',
  'Software Subscriptions',
  'Souvenirs',
  'Streaming Subscriptions',
  'Taxi and Ride-Sharing',
  'Toys and Activities',
  'Unplanned Expenses',
  'Utilities – Electricity',
  'Utilities – Gas',
  'Vehicle Maintenance',
  'Vegetables',
  'Video Games',
];

export const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  // Original mappings (some might be overridden or become less specific)
  Food: "Utensils", // General food
  Transport: "Car", // General transport
  Housing: "Home", // General housing
  Utilities: "Zap", // General utilities
  Entertainment: "Film", // General entertainment
  Health: "HeartPulse", // General health
  Shopping: "ShoppingBag", // General shopping

  // New detailed categories
  'Bathroom and Toilet Supplies': 'Bath',
  'Books and Study Materials': 'BookOpen',
  'Business Travel': 'Briefcase',
  'Cable or TV Subscription': 'Tv',
  'Car Insurance': 'ShieldCheck',
  'Charity Donations': 'Gift',
  'Childcare Services': 'Baby',
  'Clothing': 'Shirt',
  'Coffee, Snacks, and Drinks': 'Coffee',
  'Concerts and Events': 'Music',
  'Dining Out': 'Utensils', // Reuses Food icon
  'Electronics': 'Laptop',
  'Emergency Fund': 'Landmark', // Or 'ShieldAlert'
  'Entertainment Subscriptions': 'PlayCircle',
  'Fines and Penalties': 'Gavel',
  'Flight Tickets': 'Plane',
  'Food Delivery': 'Bike', // Or 'Moped' if available, 'Package'
  'Fuel': 'Fuel',
  'Gifts': 'Gift', // Reuses Charity icon
  'Groceries': 'ShoppingCart',
  'Gym and Fitness': 'Dumbbell',
  'Haircuts and Salon': 'Scissors',
  'Health Insurance': 'ShieldCheck', // Reuses Car Insurance icon or 'Activity'
  'Hobbies and Crafts': 'Brush',
  'Home Cleaning Supplies': 'Sparkles',
  'Home Decor and Furnishings': 'Sofa',
  'Hotel Stays': 'BedDouble',
  'Household Supplies': 'ShoppingBasket',
  'Income Taxes': 'Percent',
  'Internet': 'Wifi',
  "Kids' Supplies": 'Package', // Or 'ToyBrick'
  'Laundry and Dry Cleaning': 'WashingMachine',
  'Loan Payments': 'CreditCard',
  'Medical and Health Supplies': 'Pill',
  'Movies and Shows': 'Clapperboard',
  'Online Courses and Learning Platforms': 'GraduationCap',
  'Parking Fees': 'ParkingSquare',
  'Pet Food': 'Bone',
  'Pet Toys and Accessories': 'Dog', // Or 'Cat'
  'Pharmacy and Medication': 'Syringe', // Or 'Pill'
  'Professional Services': 'Users',
  'Public Transport': 'Bus',
  'Religious Offerings': 'HandCoins',
  'Rent': 'Home', // Reuses Housing
  'Repairs and Maintenance': 'Wrench',
  'School Fees': 'School',
  'Skincare and Grooming': 'Droplets',
  'Software Subscriptions': 'AppWindow',
  'Souvenirs': 'MapPin',
  'Streaming Subscriptions': 'Play',
  'Taxi and Ride-Sharing': 'CarTaxiFront',
  'Toys and Activities': 'ToyBrick',
  'Unplanned Expenses': 'AlertTriangle',
  'Utilities – Electricity': 'Zap', // Reuses Utilities
  'Utilities – Gas': 'Flame',
  'Vehicle Maintenance': 'Car', // Reuses Transport
  'Vegetables': 'Carrot',
  'Video Games': 'Gamepad2',
  'Others': "HelpCircle", // Default/fallback
};
