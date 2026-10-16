import type { Video } from "@/lib/types/video";

/** Mock video catalogue for the v0.1 demonstration. */
export const initialVideos: Video[] = [
  {
    id: "crypto-basics",
    title: "Cryptography Basics for Beginners",
    description:
      "Learn the foundations of encryption, hashing, and secure communication.",
    category: "Cryptography",
    duration: "12:40",
  },
  {
    id: "web-security",
    title: "Web Security and Safe Browsing",
    description:
      "Understand common web security risks and practical ways to protect users.",
    category: "Web Security",
    duration: "18:25",
  },
  {
    id: "password-protection",
    title: "Password Protection with PBKDF2",
    description:
      "Explore salts, key derivation, and safer password storage practices.",
    category: "Security",
    duration: "15:10",
  },
];
