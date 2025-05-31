import {
  Bath, BookOpen, Briefcase, Tv, ShieldCheck, Gift, Baby, Shirt, Coffee, Music,
  Utensils, Laptop, Landmark, PlayCircle, Gavel, Plane, Bike, Fuel, ShoppingCart,
  Dumbbell, Scissors, Activity, Brush, Sparkles, Sofa, BedDouble, ShoppingBasket,
  Percent, Wifi, Package, WashingMachine, CreditCard, Pill, Clapperboard, GraduationCap,
  ParkingSquare, Bone, Dog, Syringe, Users, Bus, HandCoins, Home, Wrench, School,
  Droplets, AppWindow, MapPin, Play, CarTaxiFront, ToyBrick, AlertTriangle, Zap,
  Flame, Car, Carrot, Gamepad2, HelpCircle, CreditCard as Mortgage, Droplet, Phone,
  Hammer, Sprout, Beer, ChefHat, Bus as RentalCar, Bike as Bicycle, Stethoscope,
  Glasses, Dumbbell as Fitness, Ticket, Mountain, Armchair, Diamond, Palette,
  Banknote, Scale, PiggyBank, Briefcase as Advisor, Key, Cloud, Truck, PawPrint,
  Ticket as EventTicket, Newspaper, ParkingSquare as ParkingPermit, Box, Hammer as Improvement,
  HeartPulse, ShieldAlert
} from 'lucide-react';

export type Account = 'R-bob' | 'R-bnb' | 'U-bob' | 'U-bnb' | 'U-dk';
export const accounts: Account[] = ['R-bob', 'R-bnb', 'U-bob', 'U-bnb', 'U-dk'];

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  account: Account; // Added account field
}

export type PaymentMethod = 'Account' | 'Cash';
export const paymentMethods: PaymentMethod[] = ['Account', 'Cash'];

export interface TransferRecord {
  id: string;
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  date: Date;
  note?: string;
}

export interface IncomeRecord extends Transaction {
  source: string;
  paymentMethod: PaymentMethod;
}

export interface ExpenseRecord extends Transaction {
  category: ExpenseCategory;
  description: string;
  paymentMethod: PaymentMethod;
}

export type ExpenseCategory =
  // Housing & Utilities
  | 'Rent'
  | 'Mortgage Payments'
  | 'Utilities – Electricity'
  | 'Utilities – Gas'
  | 'Utilities – Water'
  | 'Utilities – Internet'
  | 'Utilities – Phone'
  | 'Home Insurance'
  | 'Property Taxes'
  | 'Home Repairs and Maintenance'
  | 'Home Cleaning Supplies'
  | 'Home Decor and Furnishings'
  | 'Household Appliances'
  | 'Gardening Supplies'

  // Food & Groceries
  | 'Groceries'
  | 'Vegetables'
  | 'Dining Out'
  | 'Food Delivery'
  | 'Coffee, Snacks, and Drinks'
  | 'Alcohol and Beverages'
  | 'Meal Prep Services'

  // Transportation
  | 'Fuel'
  | 'Vehicle Maintenance'
  | 'Car Insurance'
  | 'Public Transport'
  | 'Taxi and Ride-Sharing'
  | 'Parking Fees'
  | 'Flight Tickets'
  | 'Business Travel'
  | 'Car Rental'
  | 'Tolls'
  | 'Bicycle Maintenance'

  // Personal Care & Health
  | 'Medical and Health Supplies'
  | 'Pharmacy and Medication'
  | 'Health Insurance'
  | 'Doctor Visits'
  | 'Dental Care'
  | 'Vision Care'
  | 'Skincare and Grooming'
  | 'Haircuts and Salon'
  | 'Gym and Fitness'
  | 'Spa and Wellness'

  // Education & Professional Development
  | 'School Fees'
  | 'Books and Study Materials'
  | 'Online Courses and Learning Platforms'
  | 'Professional Certifications'
  | 'Conferences and Workshops'

  // Entertainment & Leisure
  | 'Streaming Subscriptions'
  | 'Cable or TV Subscription'
  | 'Movies and Shows'
  | 'Concerts and Events'
  | 'Video Games'
  | 'Hobbies and Crafts'
  | 'Sports Equipment'
  | 'Travel and Vacations'
  | 'Hotel Stays'
  | 'Souvenirs'
  | 'Amusement Parks'

  // Shopping & Lifestyle
  | 'Clothing'
  | 'Electronics'
  | 'Gifts'
  | 'Jewelry and Accessories'
  | 'Beauty Products'
  | 'Furniture'
  | 'Pet Supplies' // Replacing 'Pet Food' and 'Pet Toys and Accessories'
  | 'Toys and Activities'
  | "Kids' Supplies"
  | 'Laundry and Dry Cleaning'

  // Financial & Legal
  | 'Loan Payments'
  | 'Income Taxes'
  | 'Fines and Penalties'
  | 'Charity Donations'
  | 'Religious Offerings'
  | 'Emergency Fund'
  | 'Investment Contributions'
  | 'Bank Fees'
  | 'Legal Services'
  | 'Financial Advisor Fees'

  // Subscriptions & Services
  | 'Software Subscriptions'
  | 'Entertainment Subscriptions'
  | 'Membership Fees' // e.g., clubs, associations
  | 'Cloud Storage Services'
  | 'Delivery Services' // e.g., Amazon Prime
  | 'Childcare Services'
  | 'Professional Services' // e.g., accounting, consulting
  | 'Home Services' // e.g., pest control, lawn care

  // Miscellaneous
  | 'Unplanned Expenses'
  | 'Cash Withdrawals'
  | 'Miscellaneous' // Replacing 'Others' for clarity
  | 'Donations' // Broader than 'Charity Donations' or 'Religious Offerings'
  | 'Pet Care' // e.g., vet visits, grooming
  | 'Event Tickets' // Broader than 'Concerts and Events'
  | 'Hobby Subscriptions' // e.g., magazines, kits
  | 'Parking Permits'
  | 'Storage Unit Fees'
  | 'Personal Items' // e.g., umbrellas, bags
  | 'Home Improvement Projects'
  | 'Fitness Classes'
  | 'Travel Insurance';

  export const expenseCategories: ExpenseCategory[] = [
    // Housing & Utilities
    'Rent',
    'Mortgage Payments',
    'Utilities – Electricity',
    'Utilities – Gas',
    'Utilities – Water',
    'Utilities – Internet',
    'Utilities – Phone',
    'Home Insurance',
    'Property Taxes',
    'Home Repairs and Maintenance',
    'Home Cleaning Supplies',
    'Home Decor and Furnishings',
    'Household Appliances',
    'Gardening Supplies',
  
    // Food & Groceries
    'Groceries',
    'Vegetables',
    'Dining Out',
    'Food Delivery',
    'Coffee, Snacks, and Drinks',
    'Alcohol and Beverages',
    'Meal Prep Services',
  
    // Transportation
    'Fuel',
    'Vehicle Maintenance',
    'Car Insurance',
    'Public Transport',
    'Taxi and Ride-Sharing',
    'Parking Fees',
    'Flight Tickets',
    'Business Travel',
    'Car Rental',
    'Tolls',
    'Bicycle Maintenance',
  
    // Personal Care & Health
    'Medical and Health Supplies',
    'Pharmacy and Medication',
    'Health Insurance',
    'Doctor Visits',
    'Dental Care',
    'Vision Care',
    'Skincare and Grooming',
    'Haircuts and Salon',
    'Gym and Fitness',
    'Spa and Wellness',
  
    // Education & Professional Development
    'School Fees',
    'Books and Study Materials',
    'Online Courses and Learning Platforms',
    'Professional Certifications',
    'Conferences and Workshops',
  
    // Entertainment & Leisure
    'Streaming Subscriptions',
    'Cable or TV Subscription',
    'Movies and Shows',
    'Concerts and Events',
    'Video Games',
    'Hobbies and Crafts',
    'Sports Equipment',
    'Travel and Vacations',
    'Hotel Stays',
    'Souvenirs',
    'Amusement Parks',
  
    // Shopping & Lifestyle
    'Clothing',
    'Electronics',
    'Gifts',
    'Jewelry and Accessories',
    'Beauty Products',
    'Furniture',
    'Pet Supplies',
    'Toys and Activities',
    "Kids' Supplies",
    'Laundry and Dry Cleaning',
  
    // Financial & Legal
    'Loan Payments',
    'Income Taxes',
    'Fines and Penalties',
    'Charity Donations',
    'Religious Offerings',
    'Emergency Fund',
    'Investment Contributions',
    'Bank Fees',
    'Legal Services',
    'Financial Advisor Fees',
  
    // Subscriptions & Services
    'Software Subscriptions',
    'Entertainment Subscriptions',
    'Membership Fees',
    'Cloud Storage Services',
    'Delivery Services',
    'Childcare Services',
    'Professional Services',
    'Home Services',
  
    // Miscellaneous
    'Unplanned Expenses',
    'Cash Withdrawals',
    'Miscellaneous',
    'Donations',
    'Pet Care',
    'Event Tickets',
    'Hobby Subscriptions',
    'Parking Permits',
    'Storage Unit Fees',
    'Personal Items',
    'Home Improvement Projects',
    'Fitness Classes',
    'Travel Insurance',
  ];

  export const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
    // Housing & Utilities
    'Rent': Home,
    'Mortgage Payments': Mortgage,
    'Utilities – Electricity': Zap,
    'Utilities – Gas': Flame,
    'Utilities – Water': Droplet,
    'Utilities – Internet': Wifi,
    'Utilities – Phone': Phone,
    'Home Insurance': ShieldCheck,
    'Property Taxes': Percent,
    'Home Repairs and Maintenance': Wrench,
    'Home Cleaning Supplies': Sparkles,
    'Home Decor and Furnishings': Sofa,
    'Household Appliances': WashingMachine,
    'Gardening Supplies': Sprout,
  
    // Food & Groceries
    'Groceries': ShoppingCart,
    'Vegetables': Carrot,
    'Dining Out': Utensils,
    'Food Delivery': Bike,
    'Coffee, Snacks, and Drinks': Coffee,
    'Alcohol and Beverages': Beer,
    'Meal Prep Services': ChefHat,
  
    // Transportation
    'Fuel': Fuel,
    'Vehicle Maintenance': Car,
    'Car Insurance': ShieldCheck,
    'Public Transport': Bus,
    'Taxi and Ride-Sharing': CarTaxiFront,
    'Parking Fees': ParkingSquare,
    'Flight Tickets': Plane,
    'Business Travel': Briefcase,
    'Car Rental': RentalCar,
    'Tolls': Gavel,
    'Bicycle Maintenance': Bicycle,
  
    // Personal Care & Health
    'Medical and Health Supplies': Pill,
    'Pharmacy and Medication': Syringe,
    'Health Insurance': Activity,
    'Doctor Visits': Stethoscope,
    'Dental Care': HelpCircle,
    'Vision Care': Glasses,
    'Skincare and Grooming': Droplets,
    'Haircuts and Salon': Scissors,
    'Gym and Fitness': Dumbbell,
    'Spa and Wellness': HeartPulse,
  
    // Education & Professional Development
    'School Fees': School,
    'Books and Study Materials': BookOpen,
    'Online Courses and Learning Platforms': GraduationCap,
    'Professional Certifications': Briefcase,
    'Conferences and Workshops': Users,
  
    // Entertainment & Leisure
    'Streaming Subscriptions': Play,
    'Cable or TV Subscription': Tv,
    'Movies and Shows': Clapperboard,
    'Concerts and Events': Music,
    'Video Games': Gamepad2,
    'Hobbies and Crafts': Brush,
    'Sports Equipment': Dumbbell,
    'Travel and Vacations': MapPin,
    'Hotel Stays': BedDouble,
    'Souvenirs': Gift,
    'Amusement Parks': Ticket,
  
    // Shopping & Lifestyle
    'Clothing': Shirt,
    'Electronics': Laptop,
    'Gifts': Gift,
    'Jewelry and Accessories': Diamond,
    'Beauty Products': Palette,
    'Furniture': Armchair,
    'Pet Supplies': PawPrint,
    'Toys and Activities': ToyBrick,
    "Kids' Supplies": Package,
    'Laundry and Dry Cleaning': WashingMachine,
  
    // Financial & Legal
    'Loan Payments': CreditCard,
    'Income Taxes': Percent,
    'Fines and Penalties': Gavel,
    'Charity Donations': Gift,
    'Religious Offerings': HandCoins,
    'Emergency Fund': PiggyBank,
    'Investment Contributions': Banknote,
    'Bank Fees': CreditCard,
    'Legal Services': Scale,
    'Financial Advisor Fees': Advisor,
  
    // Subscriptions & Services
    'Software Subscriptions': AppWindow,
    'Entertainment Subscriptions': PlayCircle,
    'Membership Fees': Key,
    'Cloud Storage Services': Cloud,
    'Delivery Services': Truck,
    'Childcare Services': Baby,
    'Professional Services': Users,
    'Home Services': Home,
  
    // Miscellaneous
    'Unplanned Expenses': AlertTriangle,
    'Cash Withdrawals': Banknote,
    'Miscellaneous': HelpCircle,
    'Donations': Gift,
    'Pet Care': Dog,
    'Event Tickets': EventTicket,
    'Hobby Subscriptions': Newspaper,
    'Parking Permits': ParkingPermit,
    'Storage Unit Fees': Box,
    'Personal Items': Package,
    'Home Improvement Projects': Improvement,
    'Fitness Classes': Fitness,
    'Travel Insurance': ShieldAlert,
  };