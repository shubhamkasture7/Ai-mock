import React from 'react';

const itSectors = [
  {
    title: "Web Development",
    link: "https://www.geeksforgeeks.org/web-development-interview-questions/",
    description: "Learn the fundamentals of web development, including front-end and back-end technologies.",
    topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "Data Science",
    link: "https://www.geeksforgeeks.org/data-science-interview-questions/",
    description: "Explore the concepts of data analysis, machine learning, and data visualization.",
    topics: ["Pandas", "NumPy", "Scikit-learn", "Data Visualization", "Python", "SQL"],
  },
  {
    title: "Machine Learning",
    link: "https://www.geeksforgeeks.org/machine-learning-interview-questions/",
    description: "Understand machine learning algorithms, models, and their applications.",
    topics: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Deep Learning", "TensorFlow", "Keras"],
  },
  {
    title: "DevOps",
    link: "https://www.geeksforgeeks.org/devops-interview-questions/",
    description: "Gain knowledge in CI/CD pipelines, automation, and infrastructure as code.",
    topics: ["Docker", "Kubernetes", "Jenkins", "CI/CD", "Terraform", "GitOps"],
  },
  {
    title: "Cyber Security",
    link: "https://www.geeksforgeeks.org/cyber-security-interview-questions/",
    description: "Master security techniques to protect systems and networks from potential threats.",
    topics: ["Encryption", "Firewalls", "Penetration Testing", "Network Security", "Malware", "Risk Management"],
  },
  {
    title: "Cloud Computing",
    link: "https://www.geeksforgeeks.org/cloud-computing-interview-questions/",
    description: "Explore cloud services like AWS, Azure, and Google Cloud for scalable computing.",
    topics: ["AWS", "Azure", "Google Cloud", "Virtualization", "Cloud Security", "Docker", "Kubernetes"],
  },
  {
    title: "Android Development",
    link: "https://www.geeksforgeeks.org/android-interview-questions/",
    description: "Dive into mobile development for Android using Java and Kotlin.",
    topics: ["Android SDK", "Kotlin", "Java", "UI/UX Design", "Firebase", "Room Database"],
  },
  {
    title: "iOS Development",
    link: "https://www.geeksforgeeks.org/ios-interview-questions/",
    description: "Learn to build mobile applications for iOS using Swift and Objective-C.",
    topics: ["Swift", "Objective-C", "Xcode", "UIKit", "Core Data", "App Store Deployment"],
  },
  {
    title: "Blockchain Development",
    link: "https://www.geeksforgeeks.org/blockchain-interview-questions/",
    description: "Understand the principles of blockchain technology and how to develop decentralized applications.",
    topics: ["Blockchain Basics", "Smart Contracts", "Ethereum", "Solidity", "Decentralized Apps (dApps)", "IPFS"],
  },
  {
    title: "Artificial Intelligence",
    link: "https://www.geeksforgeeks.org/artificial-intelligence-interview-questions/",
    description: "Delve into AI concepts, including expert systems, natural language processing, and robotics.",
    topics: ["Expert Systems", "NLP", "Robotics", "Search Algorithms", "AI Models", "Deep Learning"],
  },
  {
    title: "Internet of Things (IoT)",
    link: "https://www.geeksforgeeks.org/internet-of-things-interview-questions/",
    description: "Explore the development of smart devices and connectivity for IoT applications.",
    topics: ["IoT Architecture", "Sensors", "Embedded Systems", "IoT Protocols", "Raspberry Pi", "Arduino"],
  },
  {
    title: "Augmented Reality (AR) & Virtual Reality (VR)",
    link: "https://www.geeksforgeeks.org/augmented-reality-and-virtual-reality-interview-questions/",
    description: "Learn about the cutting-edge technologies in AR and VR for immersive experiences.",
    topics: ["Unity", "ARCore", "ARKit", "VR Headsets", "3D Modeling", "Computer Vision"],
  },
  {
    title: "Software Testing",
    link: "https://www.geeksforgeeks.org/software-testing-interview-questions/",
    description: "Gain knowledge in testing methodologies, automation tools, and quality assurance processes.",
    topics: ["Manual Testing", "Selenium", "JUnit", "TestNG", "CI/CD in Testing", "Performance Testing"],
  },
  {
    title: "Networking",
    link: "https://www.geeksforgeeks.org/computer-network-interview-questions/",
    description: "Master networking concepts and protocols necessary for network administration and security.",
    topics: ["TCP/IP", "OSI Model", "Subnetting", "Network Protocols", "Routing", "Firewalls"],
  },
  {
    title: "Database Management",
    link: "https://www.geeksforgeeks.org/database-management-system-interview-questions/",
    description: "Learn the fundamentals of relational and non-relational databases and their optimization.",
    topics: ["SQL", "Normalization", "Transactions", "Indexes", "NoSQL", "Database Design"],
  },
  {
    title: "Game Development",
    link: "https://www.geeksforgeeks.org/game-development-interview-questions/",
    description: "Explore game design, engines, and scripting to develop interactive games.",
    topics: ["Unity", "Unreal Engine", "Game Design", "Game Physics", "C#", "C++"],
  },
  {
    title: "Automation Testing",
    link: "https://www.geeksforgeeks.org/automation-testing-interview-questions/",
    description: "Get proficient in automating tests to ensure software quality.",
    topics: ["Selenium", "Cypress", "Jest", "Mocha", "Appium", "Automation Frameworks"],
  },
];

export default function ITInterviewSectors() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-10">Explore IT Interview Questions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {itSectors.map((sector, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{sector.title}</h2>
            <p className="text-sm mb-4">{sector.description}</p>
            <ul className="list-disc pl-4 mb-4">
              {sector.topics.map((topic, topicIndex) => (
                <li key={topicIndex} className="text-sm">{topic}</li>
              ))}
            </ul>
            <a
              href={sector.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
              View on GeeksforGeeks
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
