import {
    UserPlus, LayoutList, CirclePlus, FileVideo2, FileText,
    CreditCard, Ban, Images, MapPin, PencilLine, LayoutDashboard,
    Route,
    Contact,
    Building2,
    Megaphone,
    MailCheck
} from "lucide-react";

import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";

// src/constants/index.js (or wherever your navbarLinks is)



export const navbarLinks = [
    {
        title: "Dashboard",
        icon: LayoutDashboard, // <-- Add icon here
        path: "/",
    },
    {
        title: "Users",
        links: [
            { label: "Add User", icon: UserPlus, path: "/add_user" },
            { label: "Users List", icon: LayoutList, path: "/users_list" },
        ],
    },
    {
        title: "Leads",
        links: [
            
            { label: "Plan Journey List", icon: Route, path: "/plan_journey_list" },
            { label: "Contacts List", icon: Contact, path: "/contact_list" },
            { label:"Suggestions", icon: Megaphone, path: "/suggestions" },
            { label:"Subscribe", icon: MailCheck, path: "/subscribe" },
        ],
    },
    {
        title: "Itineraries",
        links: [
            { label: "Create Itinerary", icon: CirclePlus, path: "/create_itinerary" },
            { label: "Itinerary List", icon: LayoutList, path: "/itinerary_list" },
        ],
    },
    {
        title: "Images Handling",
        links: [
            { label: "Customer Gallery", icon: Images, path: "/customer_gallery" },
            { label: "Image Gallery", icon: Images, path: "/image_gallery" },
            { label: "View Image Gallery", icon: Images, path: "/view_image_gallery" },

        ],
    },
    {
        title: "Destinations",
        links: [
            { label: "Create Destination", icon: MapPin, path: "/create_destination" },
            { label: "Create City", icon: Building2, path: "/create_city" },
            // { label: "Destination List", icon: LayoutList, path: "/destination_list" },

        ],
    },
    {
        title: "Video Section",
        links: [
            { label: "Hero Video", icon: FileVideo2, path: "/hero_video" },
            { label: "Testimonial Video", icon: FileVideo2, path: "/video_testimonials_upload" },
        ],
    },
    {
        title: "Terms",
        links: [
            { label: "Terms & Conditions", icon: FileText, path: "/terms_and_conditions" },
            { label: "Payment Mode Terms", icon: CreditCard, path: "/payment_mode" },
            { label: "Cancellation Policy", icon: Ban, path: "/cancellation_policy" },
        ],
    },


    {
        title: "Blog",
        links: [
            { label: "Create Blog", icon: PencilLine, path: "/create_blog" },
            { label: "Blogs List", icon: LayoutList, path: "/blogs_list" },
        ],
    },
];

export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];
