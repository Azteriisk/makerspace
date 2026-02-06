export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
};

export type Event = {
    id: string;
    title: string;
    date: string; // ISO date string
    time: string;
    description: string;
    instructor: string;
    spotsTotal: number;
    spotsTaken: number;
    price: number;
};

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Arduino Uno R4 WiFi",
        description: "The classic Arduino board, now with WiFi and a 32-bit Cortex M4 microcontroller.",
        price: 27.50,
        category: "Microcontrollers",
        image: "/images/arduino-uno.jpg",
        inStock: true,
    },
    {
        id: "p2",
        name: "Raspberry Pi 5 (8GB)",
        description: "The latest generation Raspberry Pi. 2-3x faster than the Pi 4.",
        price: 80.00,
        category: "Computers",
        image: "/images/rpi5.jpg",
        inStock: true,
    },
    {
        id: "p3",
        name: "Creality PLA Filament (White)",
        description: "High quality 1.75mm PLA filament for FDM 3D printing.",
        price: 22.00,
        category: "3D Printing",
        image: "/images/filament-white.jpg",
        inStock: true,
    },
    {
        id: "p4",
        name: "Soldering Station (60W)",
        description: "Adjustable temperature soldering iron with stand and sponge.",
        price: 45.00,
        category: "Tools",
        image: "/images/soldering-station.jpg",
        inStock: true,
    },
    {
        id: "p5",
        name: "Sensor Kit (37 Modules)",
        description: "Comprehensive sensor kit including temp, motion, sound, and light sensors.",
        price: 35.99,
        category: "Electronics",
        image: "/images/sensor-kit.jpg",
        inStock: false,
    },
    {
        id: "p6",
        name: "Servo Motor SG90",
        description: "Micro servo motor for robotics and small mechanisms.",
        price: 4.50,
        category: "Robotics",
        image: "/images/servo.jpg",
        inStock: true,
    },
];

export const INITIAL_EVENTS: Event[] = [
    {
        id: "e1",
        title: "Intro to 3D Printing",
        date: "2026-03-10",
        time: "18:00 - 20:00",
        description: "Learn the basics of FDM printing, slicing, and machine safety.",
        instructor: "Sarah Jenkins",
        spotsTotal: 8,
        spotsTaken: 4,
        price: 25.00,
    },
    {
        id: "e2",
        title: "Arduino for Beginners",
        date: "2026-03-12",
        time: "17:30 - 19:30",
        description: "Write your first code and blink an LED. Hardware included.",
        instructor: "David Chen",
        spotsTotal: 12,
        spotsTaken: 10,
        price: 40.00,
    },
    {
        id: "e3",
        title: "Drone Flight & Repair",
        date: "2026-03-15",
        time: "10:00 - 13:00",
        description: "Learn to fly and fix common drone issues. Bring your own or use ours.",
        instructor: "Mike Ross",
        spotsTotal: 6,
        spotsTaken: 2,
        price: 45.00,
    },
    {
        id: "e4",
        title: "Weekly Tech Literacy",
        date: "2026-03-20",
        time: "18:00 - 19:30",
        description: "Free session covering basic computer skills and internet safety.",
        instructor: "Alec Brandt",
        spotsTotal: 15,
        spotsTaken: 3,
        price: 0.00,
    },
    {
        id: "e5",
        title: "Advanced PCB Design",
        date: "2026-03-24",
        time: "18:00 - 21:00",
        description: "From schematic to KiCad layout. Intermediate experience required.",
        instructor: "Alice Wu",
        spotsTotal: 10,
        spotsTaken: 0,
        price: 55.00,
    },
];

export const TEAM_MEMBERS = [
    {
        id: "t1",
        name: "Alec Brandt",
        role: "Founder & Managing Director",
        bio: "Business professional and sales leader from Central Arkansas with a deep passion for technology. Focused on tailoring solutions to fit unique goals and fostering community innovation.",
        image: "/images/alec.jpg"
    },
    {
        id: "t2",
        name: "Jack Haygood",
        role: "Founding Partner",
        bio: "Specializes in network infrastructure and cybersecurity. Passionate about building secure, resilient systems and teaching others how to protect their digital lives.",
        image: "/images/jack.jpg"
    }
];
