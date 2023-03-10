import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: "Minth",
            email: "admin@example.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: "Guest",
            email: "user@example.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: false
        }
    ],
    products: [
        {
            name: "Grey Striped Cuddler Dog Bed",
            slug: "grey-striped-cuddler-dog-bed",
            category: "Beds & Furniture",
            brand: "Top Paw",
            price: 11.99,
            description: "Size 18'L x 20'W x 6.5'H",
            reviewNum: 25,
            countInStock: 9,
            rating: 5,
            image: "/images/bed1.jpg",
        },
        {
            name: "Pig Squishy Pillow Dog Bed",
            slug: "top-paw-pig-squishy-pillow-dog-bed",
            category: "Beds & Furniture",
            brand: "Top Paw",
            price: 24.99,
            description: "Size 24'L x 20'W",
            reviewNum: 19,
            countInStock: 99,
            rating: 4.5,
            image: "/images/bed2.jpg",
        },
        {
            name: "Kandh Elevated Pet Cot",
            slug: "kandh-elevated-pet-cot",
            category: "Beds & Furniture",
            brand: "K&H",
            price: 57.39,
            description: "Size 50'L x 32'W x 9'H",
            reviewNum: 22,
            countInStock: 45,
            rating: 5,
            image: "/images/bed3.jpg",
        },
        {
            name: "Cloudscape Handwoven Pet Bed",
            slug: "cloudscape-handwoven-pet-bed",
            category: "Beds & Furniture",
            brand: "Petpals",
            price: 39,
            description: "Size 16'L x 16'W x 4'H",
            reviewNum: 63,
            countInStock: 19,
            rating: 5,
            image: "/images/bed4.jpg",
        },
        {
            name: "Cincinnati Bengals NFL Team Tee",
            slug: "cincinnati-bengals-nfl-team-tee",
            category: "Clothing & Shoes",
            brand: "Pets first",
            price: 19.99,
            description: "Jerseys & Team Sports",
            reviewNum: 28,
            countInStock: 99,
            rating: 4,
            image: "/images/cloth1.jpg",
        },
        {
            name: "New England Patriots NFL Reversible Bandana",
            slug: "new-england-patriots-nfl-reversible-bandana",
            category: "Clothing & Shoes",
            brand: "Pets first",
            price: 14.85,
            description: "Jerseys & Team Sports Spirits",
            reviewNum: 92,
            countInStock: 89,
            rating: 4.5,
            image: "/images/cloth2.jpg",
        },
        {
            name: "New York Giants Signature Pro Dog Collar",
            slug: "new-york-giants-signature-pro-dog-collar",
            category: "Collars, Harnesses & Leashes",
            brand: "Pets first",
            price: 17.5,
            description: "Freesize for dogs over 18 kilograms",
            reviewNum: 48,
            countInStock: 50,
            rating: 4,
            image: "/images/collar1.jpg",
        },
        {
            name: "Waste Bag Dog Harness",
            slug: "waste-bag-dog-harness",
            category: "Collars, Harnesses & Leashes",
            brand: "Kong",
            price: 39.99,
            description: "Opt for dog harnesses made from either nylon or leather",
            reviewNum: 18,
            countInStock: 80,
            rating: 5,
            image: "/images/collar2.jpg",
        },
    ]
}

export default data