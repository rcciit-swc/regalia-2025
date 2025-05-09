import {
  Award,
  Camera,
  Code,
  Code2Icon,
  HeartHandshake,
  Mic,
  Paintbrush,
  Star,
  Zap,
} from 'lucide-react';
import { FaMoneyCheck } from 'react-icons/fa';

export const teams = [
  {
    category: 'Faculty',
    id: 'faculty',
    path: '/team/faculty',
    icon: <HeartHandshake className="text-yellow-200" />,
    members: [
      {
        name: 'Dr. Anirban Mukherjee',
        role: 'Principal , RCCIIT',
        image: 'https://i.postimg.cc/90XVTrYM/Shin2_0060.jpg',
      },
      {
        name: 'Mr. Sandip Saha',
        role: 'Registrar, RCCIIT',
        image:
          'https://i.postimg.cc/7Lqz5NTr/WhatsApp_Image_2024-05-06_at_00.54.21_e51a6ee6.jpg',
      },
      {
        name: 'Mr. Pradip Kumar Das',
        role: 'Deputy Registrar, RCCIIT',
        image:
          'https://i.postimg.cc/N0FVvRfB/WhatsApp_Image_2024-05-06_at_00.41.14_5e8d2db7.jpg',
      },
      {
        name: 'Mr. Harinandan Tunga',
        role: 'Faculty-In-Charge SA & SW ',
        image:
          'https://i.postimg.cc/K8KbFGrp/78becf57-0d9d-45c3-8dcb-d2de974fe10f.jpg',
      },
      {
        name: 'Dr. Abhijit Das',
        role: 'Faculty Advisor (Cultural)',
        image: 'https://i.postimg.cc/rstgySy7/abhijit.jpg',
        phone: '+91 9830444823',
      },
      {
        name: 'Mr. Rajib Saha',
        role: 'Faculty Coordinator (Technical)',
        image:
          'https://i.postimg.cc/nrJFqwRV/d45a6a91-8afa-4e51-983b-963301a16cd4.jpg',
        phone: '+91 98303 73904',
      },
      {
        name: 'Mr. Sarbojit Mukherjee',
        role: 'Faculty Coordinator (Sports)',
        image:
          'https://i.postimg.cc/VvD2ngKr/Whats-App-Image-2025-04-27-at-09-25-34-03d51234.jpg',
      },
    ],
  },
  //SWC team completed
  {
    category: 'SWC',
    id: 'swc',
    path: '/team/swc',
    icon: <Award className="text-yellow-200" />,
    members: [
      {
        name: 'Manish Biswas',
        role: 'Asst. General Secretary (Cultural)',
        image: 'https://i.postimg.cc/sXJX7yNG/Whats-App-Image-2025-05-09-at-11-58-48-8b435271.jpg',
        phone: '+91 9876543210',
      },
      {
        name: 'Basanta Kumar Shaw',
        role: 'General Secretary',
        image: 'https://i.imgur.com/rOJZqPR.jpg',
        phone: '+91 7547927975',
      },
      {
        name: 'Ankita Dhara',
        role: 'Asst. General Secretary (Tech)',
        image: 'https://i.postimg.cc/4d9j63DS/IMG_1674_(1)_-_ANKITA_DHARA.jpg',
        phone: '+91 8820534958',
      },

      {
        name: 'Subhranil Saha',
        role: 'Asst. General Secretary (Sports)',
        image: 'https://i.postimg.cc/1Rvqp59Y/IMG-1419-SUBHRANIL-SAHA.webp',
        phone: '+91 81016 96445',
      },
    ],
  },
  //convener team picture remaining
  {
    category: 'Convenors',
    id: 'convenors',
    path: '/team/convenors',
    icon: <Star className="text-yellow-200" />,
    members: [
      {
        name: 'Soham Saha',
        role: 'Sargam Convenor',
        image:
          'https://i.postimg.cc/yYDhwm8g/IMG-20240916-190106-238-SOHAM-SAHA.webp',
      },
      {
        name: 'Swapnil Chowdhury',
        role: 'Band Bash Convenor',
        image:
          'https://i.postimg.cc/jdyxByTQ/Whats-App-Image-2025-05-09-at-13-34-09-cd361213.jpg',
      },
      {
        name: 'Harsh Jaiswal',
        role: 'Carpe Diem Convenor',
        image: 'https://i.postimg.cc/ncTNnsNf/harsh.jpg',
      },
      {
        name: 'Sayantika Bera',
        role: 'Kashish-E-Haya Convenor',
        image:
          'https://i.postimg.cc/W4Gw5sb5/B612-20250427-210411-075-SAYANTIKA-BERA.jpg',
      },
      {
        name: 'Arhit Ghosh',
        role: 'Jhankar Convenor',
        image:
          'https://i.postimg.cc/6QnYFdzL/Adobe-Scan-19-Dec-2020-1-ARHIT-GHOSH.jpg',
      },

      {
        name: 'Tanishka Chatterjee',
        role: 'Nrityam Convenor',
        image:
          'https://i.postimg.cc/5t4XMJS7/Shin-3-0038-Original-TANISHKA-CHATTERJEE.jpg',
      },
      {
        name: 'Debjit Sarkar',
        role: 'Voice of Emotions Convenor',
        image: 'https://i.postimg.cc/vTNr4B3Z/IMG-0544-DEBJIT-SARKAR-1.jpg',
      },
    ],
  },
  {
    category: 'Coordinators',
    id: 'coordinators',
    path: '/team/coordinators',
    icon: <Star className="text-yellow-200" />,
    members: [
      {
        name: 'Arijit Sarkar',
        role: 'Sargam',
        image: 'https://i.postimg.cc/44LbLLsR/IMG-2665-ARIJIT-SARKAR.jpg',
      },
      {
        name: 'Souvik Pratihar',
        role: 'Sargam',
        image:
          'https://i.postimg.cc/Qt65zCLJ/IMG-20250502-195002-SOUVIK-PRATIHAR.jpg',
      },
      {
        name: 'Palas Saha',
        role: 'Band Bash',
        image: 'https://i.postimg.cc/76rQLBbW/123-PALAS-SAHA-1.jpg',
      },
      {
        name: 'Shreya Dutta',
        role: 'Carpe Diem',
        image: 'https://i.postimg.cc/MT4HRQ2N/Sou-6617-SHREYA-DUTTA.jpg',
      },
      {
        name: 'Purbasha Haldar',
        role: 'Kashish-E-Haya',
        image:
          'https://i.postimg.cc/RZCkGtZ0/Whats-App-Image-2025-05-09-at-13-39-47-4d350bdd.jpg',
      },
      {
        name: 'Soham Mallick',
        role: 'Kashish-E-Haya',
        image:
          'https://i.postimg.cc/SRDZDkdB/6ef094db-085a-4195-afce-41928ec1c9cb-SOHAM-MALLICK.jpg',
      },
      {
        name: 'Riddhita Goswami',
        role: 'Jhankar',
        image: 'https://i.postimg.cc/CxHRt5kn/Shin-2-0670-RIDDHITA-GOSWAMI.jpg',
      },
      {
        name: 'Sanmitra Dutta',
        role: 'Wall of Wonders',
        image:
          'https://i.postimg.cc/BQFLTMvg/IMG-20250124-WA0020-SANMITRA-DUTTA.jpg',
      },
      {
        name: 'Arghadeep Saha',
        role: 'Pixel Perfect',
        image:
          'https://i.postimg.cc/xTLBhx38/B612-20240120-231801-069-Arghadeep-Saha.jpg',
      },
      {
        name: 'Shinjan Sarkar',
        role: 'Pixel Perfect',
        image: 'https://i.postimg.cc/HxLx62m1/DSC-1347-Shinjan-Sarkar.jpg',
      },
      {
        name: 'Astha Haldar',
        role: 'Nrityam',
        image: 'https://i.postimg.cc/pXcGjVp8/1745821552665-ASTHA-HALDER.jpg',
      },
      {
        name: 'Souravi Samui',
        role: 'Voice of Emotions',
        image:
          'https://i.postimg.cc/59TQQZfy/Screenshot-20250429-192042-Instagram-SOURAVI-SAMUI.jpg',
      },
    ],
  },
  {
    category: 'Volunteers',
    id: 'volunteers',
    path: '/team/volunteers',
    icon: <Star className="text-yellow-200" />,
    members: [
      {
        name: 'Anubhab Das',
        role: 'Band Bash',
        image: 'https://i.postimg.cc/yd7X52Ds/DSC01327-ANUBHAB-DAS.jpg',
      },
      {
        name: 'Supratim Sen',
        role: 'Band Bash',
        image:
          'https://i.postimg.cc/SsKYc4X2/IMG-20250503-162323-SUPRATIM-SEN.jpg',
      },
      {
        name: 'Aatreyee Misra',
        role: 'Carpe Diem',
        image:
          'https://i.postimg.cc/j5vQrvfN/e2b0320ab9d7439ebf158e87668f91ef-AATREYEE-MISRA.jpg',
      },
      {
        name: "Bidisha Das",
        role: 'Carpe Diem',
        image:
          'https://i.postimg.cc/j2X8J8N4/Whats-App-Image-2025-05-09-at-14-12-52-9644c484.jpg',
      },
      {
        name: 'Omi Dhir',
        role: 'Kashish-E-Haya',
        image: 'https://i.postimg.cc/MGSyMgbV/IMG-20250223-205826-OMI-DHIR.jpg',
      },

      {
        name: 'Kanchan Debanth',
        role: 'Wall of Wonders',
        image:
          'https://i.postimg.cc/jSGM886S/1746168820429-KANCHAN-DEBNATH.jpg',
      },
      {
        name: 'Shubhechha Samanta',
        role: 'Nrityam',
        image:
          'https://i.postimg.cc/m21MdTm7/IMG-20250503-101707-SHUBHECHHA-SAMANTA.jpg',
      },
      {
        name: 'Swapnanil Chakraborty',
        role: 'Jhankar',
        image:
          'https://i.postimg.cc/HnV51mdD/IMG-20250502-073015-SWAPNANIL-CHAKRABORTY.jpg',
      },
      {
        name: 'Meghna Santra',
        role: 'Voice of Emotions',
        image:
          'https://i.postimg.cc/v833R87j/B612-20250403-090420-762-MEGHNA-SANTRA-1.jpg',
      },
    ],
  },
  //tech team completed
  {
    category: 'Tech Team',
    id: 'tech',
    path: '/team/tech',
    icon: <Code2Icon className="text-yellow-200" />,
    members: [
      {
        name: 'Arghya Dutta',
        role: 'Tech Team Lead',
        image: 'https://i.postimg.cc/dQhs9jgT/IMG-20250202-133035.jpg',
      },
      {
        name: 'Nasiruddin Thander',
        role: 'Tech Co-Lead',
        image:
          'https://i.postimg.cc/L6TNgZ5Y/Nasiruddin-Thander-NASIRUDDIN-THANDER.jpg',
      },
      {
        name: 'Soumyaraj Bag',
        role: 'Tech Team Member',
        image: 'https://i.postimg.cc/mrMsZLQ3/bag2.jpg',
      },
      {
        name: 'Anirban Majumder',
        role: 'Tech Team Member',
        image:
          'https://i.postimg.cc/pTNC8qnk/91-62966-13379-20250304-092842-ANIRBAN-MAJUMDER.jpg',
      },
      {
        name: 'Pratyush Pal',
        role: 'Tech Team Member',
        image: 'https://i.postimg.cc/gkw3Hq9K/Pratyush-Pal.jpg',
      },
      {
        name: 'Subhadeep Dhar',
        role: 'Tech Team Member',
        image: 'https://i.postimg.cc/t47zrCbq/1720191675352.jpg',
      },
      {
        name: 'Dibakar Banerjee',
        role: 'Tech Team Member',
        image:
          'https://i.postimg.cc/3RX1g4ZN/Whats-App-Image-2025-07-19-at-18-29-51.jpg',
      },
      {
        name: 'Palas Saha',
        role: 'Tech Team Member',
        image:
          'https://i.postimg.cc/HLJ2NZ2X/IMG-20240404-123644-PALAS-SAHA.jpg',
      },
      {
        name: 'Arnab Mondal',
        role: 'Tech Team Member',
        image: 'https://i.postimg.cc/7Y2yc7kh/IMG-20231016-215431-1.jpg',
      },
      {
        name: 'Sutanuka Chakraborty',
        role: 'UI/UX Designer',
        image:
          'https://i.postimg.cc/SR5rWwPQ/IMG-20240830-WA0150-Sutanuka-Chakraborty.jpg',
      },
      {
        name: 'Rishi Paul',
        role: 'Tech Team Member',
        image:
          'https://i.postimg.cc/zBVyKZny/7be2c20b-8d97-4bc2-9d98-c17432dcae92.jpg',
      },
      // {
      //   name: 'Aditi Ghosh',
      //   role: 'Tech Team Member',
      //   image: 'https://i.postimg.cc/7Y2yc7kh/IMG-20231016-215431-1.jpg',
      // },
    ],
  },
  // {
  //   category: 'Management',
  //   id: 'management',
  //   path: '/team/management',
  //   icon: <Code className="text-yellow-200" />,
  //   members: [
  //     // {
  //     //   name: 'Joydeep Das',
  //     //   role: 'Artist Management Team',
  //     //   image: 'https://i.postimg.cc/sfMTwqxz/bag.jpg',
  //     // },
  //     {
  //       name: 'Dibakar Banerjee',
  //       role: 'Convenor',
  //       image:
  //         'https://i.postimg.cc/3RX1g4ZN/Whats-App-Image-2025-07-19-at-18-29-51.jpg',
  //     },
  //     {
  //       name: 'Rwitam Ray',
  //       role: 'Robotics POC',
  //       image:
  //         'https://i.postimg.cc/MpYBwCYc/IMG-20240401-WA0013-1-Rwitam-Ray.jpg',
  //     },
  //   ],
  // },
  {
    category: 'Graphics Team',
    id: 'graphics',
    path: '/team/graphics',
    icon: <Paintbrush className="text-yellow-200" />,
    members: [
      {
        name: 'Hirak Sabui',
        role: 'Graphics Team Lead',
        image:
          'https://i.postimg.cc/VkNVcR8x/Whats-App-Image-2025-05-09-at-12-08-49-91b2a168.jpg',
      },
      {
        name: 'Debdatta Ray',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/KvC7F119/IMG-20241212-131540-DEBDATTA-RAY.jpg',
      },
      {
        name: 'Tirtha Bhattacharyya',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/BQxkby5p/Whats-App-Image-2025-02-22-at-9-37-01-PM-TIRTHA-BHATTACHARYYA.jpg',
      },
      {
        name: 'Sohom Sarkar',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/J0DydQ5R/IMG-20241008-WA0176_-_SOHOM_SARKAR.jpg',
      },
      {
        name: 'Santanu Srivastava',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/vBSgzK9P/IMG-20240921-WA0002-SANTANU-SRIVASTAVA.jpg',
      },
      {
        name: 'Poulami Saha',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/HkGMRFNR/IMG-20250507-083309-POULAMI-SAHA.jpg',
      },
      {
        name: 'Soumi Khanra',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/8zN36HtS/IMG-20230511-WA0023-SOUMI-KHANRA.jpg',
      },
      // {
      //   name: 'Bhumika Das',
      //   role: 'Graphics Team Member',
      //   image:
      //     'https://i.postimg.cc/JzxFck2B/IMG-20250125-WA0068-1-BHUMIKA-DAS.jpg',
      // },
      // {
      //   name: 'Sayani Halder',
      //   role: 'Graphics Team Member',
      //   image:
      //     'https://i.postimg.cc/R00DPZkp/IMG-20241222-WA0024-SAYANI-HALDER.jpg',
      // },
      {
        name: 'Ankur Bag',
        role: 'Graphics Team Member',
        image:
          'https://i.postimg.cc/bJYkLb5v/IMG-20250407-140242-429-ANKUR-BAG.webp',
      },
    ],
  },
  // coverage team completed
  {
    category: 'Coverage Team',
    id: 'coverage',
    path: '/team/coverage',
    icon: <Camera className="text-yellow-200" />,
    members: [
      {
        name: 'Sambit Sarkar',
        role: 'Coverage Team Lead',
        image:
          'https://i.postimg.cc/9fCz72NM/IMG-20230318-133918-244-Sambit-Sarkar.jpg',
      },
      {
        name: 'Shinjan Sarkar',
        role: 'Coverage Team Member',
        image: 'https://i.postimg.cc/HxLx62m1/DSC-1347-Shinjan-Sarkar.jpg',
      },
      {
        name: 'Arghadeep Saha',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/xTLBhx38/B612-20240120-231801-069-Arghadeep-Saha.jpg',
      },
      {
        name: 'Ritam Kar',
        role: 'Coverage Team Member',
        image: 'https://i.postimg.cc/zvYYH9km/ritamkar.jpg',
      },
      {
        name: 'Rishav Pramanik',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/T1z3YvDT/IMG-20241013-WA0036-Rishav-Pramanik.jpg',
      },
      {
        name: 'Shubham Paul',
        role: 'Coverage Team Member',
        image: 'https://i.postimg.cc/kG65mgDj/DSC-2534-1-Subham-Paul.jpg',
      },
      {
        name: 'Saikat Mondal',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/cC2rg8Vy/Untitled-design-SAIKAT-MONDAL.jpg',
      },
      {
        name: 'Ranit Sarkar',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/8z87TMRL/Whats-App-Image-2025-02-22-at-19-04-31-f0b88fad-Texh-Uf.jpg',
      },
      {
        name: 'Soumya Das',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/Jndhvk7D/PSX-20240308-115804-Soumya-Das.jpg',
      },
      {
        name: 'Bhumika Das',
        role: 'Coverage Team Member',
        image:
          'https://i.postimg.cc/v8N1SpDq/IMG-20250125-WA0068-1-BHUMIKA-DAS.jpg',
      },
      {
        name: 'Nirmalya Karmakar',
        role: 'Coverage Team Member',
        image: 'https://i.postimg.cc/x11DmGLd/nirmalya.jpg',
      },
    ],
  },
  //PR team completed
  {
    category: 'PR & Outreach Team',
    id: 'pr',
    path: '/team/pr',
    icon: <Mic className="text-yellow-200" />,
    members: [
      {
        name: 'Manali Mukherjee',
        role: 'PR & Outreach Lead',
        image:
          'https://i.postimg.cc/nhts0Bjt/In-Collage-20241104-014019775-MANALI-MUKHERJEE.jpg',
      },
      {
        name: 'Shuvojyoti Biswas ',
        role: 'PR & Outreach Team',
        image:
          'https://i.postimg.cc/0jQG5mG4/FB-IMG-1746147121058-SHUVOJYOTI-BISWAS.jpg',
      },
    ],
  },
  // // logistics team completed
  // {
  //   category: 'Logistics Team',
  //   id: 'logistics',
  //   path: '/team/logistics',
  //   members: [
  //     {
  //       name: 'Arnab Dey',
  //       role: 'Logistics Team Lead',
  //       image: 'https://i.postimg.cc/0NGnY7ds/EjMuVkC.jpg',
  //     },
  //     {
  //       name: 'Aditya Chakraborty',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/rsjNBTZY/IMG-20231128-WA0006-ADITYA-CHAKRABORTY.jpg',
  //     },
  //     {
  //       name: 'Arnob Podder',
  //       role: 'Logistics Team Member',
  //       image: 'https://i.postimg.cc/3RcKn0YL/IMG-2897-ARNOB-PODDER.jpg',
  //     },
  //     {
  //       name: 'Ankan Ghosh',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/kXrypj1m/IMG-20250224-WA0046-ANKAN-GHOSH.jpg',
  //     },
  //     {
  //       name: 'Mohit Chowdhury',
  //       role: 'Logistics Team Member',
  //       image: 'https://i.postimg.cc/h4Xxg9zt/IMG-9828-MOHIT-CHOWDHURY.jpg',
  //     },
  //     {
  //       name: 'Tarif Chowdhury',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/52X2Ch4r/9b562a9e-eeb4-4170-b15c-694e8c584c30.jpg',
  //     },
  //     {
  //       name: 'Pratik Chowdhury',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/28v0jpby/20250304-142312-ANUSHKA-GHOSH.jpg',
  //     },
  //     {
  //       name: 'Somen Saha',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/hjq8hvH5/IMG20250203162227-imresizer-SOMEN-SAHA.jpg',
  //     },
  //     {
  //       name: 'Supratim Sen',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/kDr7drVK/IMG-20250305-020623-SUPRATIM-SEN.jpg',
  //     },
  //     {
  //       name: 'Sagar Raj Yadav',
  //       role: 'Logistics Team Member',
  //       image:
  //         'https://i.postimg.cc/nr9n5VLn/IMG20240710105920-SAGAR-RAJYADAV.jpg',
  //     },
  //   ],
  // },
  //sponsorship team completed
  {
    category: 'Sponsorship Team',
    id: 'sponsorship',
    path: '/team/sponsorship',
    icon: <FaMoneyCheck className="text-yellow-200" />,
    members: [
      {
        name: 'Rwitam Ray',
        role: 'Sponsorship Team Lead',
        image:
          'https://i.postimg.cc/MpYBwCYc/IMG-20240401-WA0013-1-Rwitam-Ray.jpg',
      },
      {
        name: 'Sourodeep Paul',
        role: 'Sponsorship Team Member',
        image:
          'https://i.postimg.cc/QNbnXJDf/20250503-131921-Sourodeep-Paul.png',
      },
      {
        name: 'Smaranika Porel',
        role: 'Sponsorship Team Member',
        image:
          'https://i.postimg.cc/mry7QV8q/IMG-20250116-205444-949-SMARANIKA-POREL.webp',
      },
      {
        name: 'Nilotpal Guha',
        role: 'Sponsorship Team Member',
        image:
          'https://i.postimg.cc/ZYG7pSJ3/image-20250222-095017-983-73-Nilotpal-Guha.jpg',
      },
      {
        name: 'Shriza Baidya',
        role: 'Sponsorship Team Member',
        image:
          'https://i.postimg.cc/HnpZwVw0/20250415-152440-1-SHRIZA-BAIDYA.jpg',
      },
      {
        name: 'Bhumika Das',
        role: 'Sponsorship Team Member',
        image:
          'https://i.postimg.cc/JzxFck2B/IMG-20250125-WA0068-1-BHUMIKA-DAS.jpg',
      },
    ],
  },
  // {
  //   category: 'Security Team',
  //   id: 'security',
  //   path: '/team/security',
  //   members: [
  //     {
  //       name: 'Bibasan Mitra',
  //       role: 'Security Team Lead',
  //       image:
  //         'https://i.postimg.cc/m2cPtsTJ/IMG-20250303-091158-BIBASAN-MITRA.jpg',
  //     },
  //     {
  //       name: 'Trideep Roy',
  //       role: 'Security Team Member',
  //       image:
  //         'https://i.postimg.cc/j5pyB5hX/IMG-20250303-124708-TRIDEEP-ROY.jpg',
  //     },
  //     {
  //       name: 'Imran Alam',
  //       role: 'Security Team Member',
  //       image:
  //         'https://i.postimg.cc/Qt9p65cC/IMG-20250303-WA0011-IMRAN-ALAM.jpg',
  //     },
  //   ],
  // },
  //food team completed
  // {
  //   category: "Food Team",
  //   id: "food",
  //   path: "/team/food",
  //   members: [
  //     {
  //       name: "Sunanda Das",
  //       role: "Food & Refreshments Team Lead",
  //       image: "https://i.postimg.cc/YCHTWxjv/SUNANDA-DAS.jpg",
  //     },
  //     {
  //       name: "Diptodeep Biswas",
  //       role: "Food & Refreshments Team Lead",
  //       image: "https://i.postimg.cc/05hKwLd4/IMG-20230105-212922.jpg",
  //     },
  //     {
  //       name: "Sambhabi Das",
  //       role: "Food & Refreshments Team Member",
  //       image: "https://i.postimg.cc/mrZqd2YR/Sambhabi-Das.jpg",
  //     },
  //     {
  //       name: "Nikiza Biswas",
  //       role: "Food & Refreshments Team Member",
  //       image: "https://i.postimg.cc/1zWdbhBF/NIKIZA-BISWAS.jpg",
  //     },
  //   ],
  // },
  //register team completed
  // {
  //   category: 'Registration Team',
  //   id: 'registration',
  //   path: '/team/registration',
  //   members: [
  //     {
  //       name: 'Ankita Naskar',
  //       role: 'Registration Team Lead',
  //       image:
  //         'https://i.postimg.cc/3xf1n5g3/IMG-20250222-210125-ANKITA-NASKAR.jpg',
  //     },
  //     {
  //       name: 'Sambhabi Das',
  //       role: 'Registration Team Member',
  //       image: 'https://i.postimg.cc/ydzhWVmY/IMG-1178-SAMBHABI-DAS.jpg',
  //     },
  //     {
  //       name: 'Debdyuti Mondal',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/xCTF4TBF/IMG-20250222-WA0046-1-DEBDYUTI-MONDAL.jpg',
  //     },
  //     {
  //       name: 'Arijit Saha',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/J7xN68Rd/da0248d4-5b5b-4da6-ab89-290ad76e8c58.jpg',
  //     },
  //     {
  //       name: 'Debatree Chanda',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/7YBNXrkm/IMG-20250208-232032-DEBATREE-CHANDA.jpg',
  //     },
  //     {
  //       name: 'Kasturi Bhattacharya',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/pdjY29n6/DSC-1397-KASTURI-BHATTACHARYA.jpg',
  //     },
  //     {
  //       name: 'Sreejit Mondal ',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/Z5CxMsYZ/New-Doc-10-23-2024-22-56-removebg-preview-SREEJIT-MONDAL.png',
  //     },
  //     {
  //       name: 'Monaj Barman ',
  //       role: 'Registration Team Member',
  //       image:
  //         'https://i.postimg.cc/BnkB95tF/IMG-20230529-140649-900-removebg-preview-1-MONAJ-BARMAN.png',
  //     },
  //   ],
  // },
];
