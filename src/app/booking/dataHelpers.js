import staff1 from "../../../public/staff1.png";
import staff2 from "../../../public/staff2.png";
import staff3 from "../../../public/staff3.png";
import staff4 from "../../../public/staff4.png";
import staff5 from "../../../public/staff5.png";
import staff6 from "../../../public/staff6.png";
import service1_1 from "../../../public/service1_1.png";
import service1_2 from "../../../public/service1_2.png";
import service1_3 from "../../../public/service1_3.png";
import service1_4 from "../../../public/service1_4.png";
import extension1 from "../../../public/extension1.png";
import extension2 from "../../../public/extension2.png";
import extension3 from "../../../public/extension3.png";
import extension4 from "../../../public/extension4.png";
import taking1 from "../../../public/taking1.png";
import taking2 from "../../../public/taking2.png";
import taking3 from "../../../public/taking3.png";
import waxing1 from "../../../public/waxing.png";
import waxing2 from "../../../public/waxing2.png";
import waxing3 from "../../../public/waxing3.png";
import waxing4 from "../../../public/waxing4.png";

export const staffData = [
  {
    id: "1",
    name: "Alice Nguyen",
    stars: 4,
    subtitle: "Expert in nail art and manicures.",
    image: staff1,
  },
  {
    id: "2",
    name: "David Tran",
    stars: 5,
    subtitle: "Specialist in gel and acrylic nails.",
    image: staff2,
  },
  {
    id: "3",
    name: "Sophia Le",
    stars: 3,
    subtitle: "Focused on providing quality pedicures.",
    image: staff3,
  },
  {
    id: "4",
    name: "Michael Pham",
    stars: 2,
    subtitle: "Junior technician learning advanced techniques.",
    image: staff4,
  },
  {
    id: "5",
    name: "Emily Hoang",
    stars: 5,
    subtitle: "Renowned for her creative nail designs.",
    image: staff5,
  },
  {
    id: "6",
    name: "John Vu",
    stars: 4,
    subtitle: "Experienced in waxing and nail care.",
    image: staff6,
  },
];

export const timeData = [
   "09:00", "09:15", "09:30", "09:45", "10:00", "10:15",   "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",   "12:00", "12:15", "12:30", "12:45", "13:00", "13:15",   "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",   "15:00", "15:15", "15:30", "15:45", "16:00", "16:15",   "16:30", "16:45", "17:00", "17:15", "17:30", "17:45",   "18:00"

];

export const data = {
  natural: [
    {
      id: "1",
      title: "Classic Manicure with Regular Color",
      price: "20$",
      chose: false,
      image: service1_1,
    },
    {
      id: "2",
      title: "Classic Pedicure with Regular Color",
      price: "30$",
      chose: false,
      image: service1_2,
    },
    {
      id: "3",
      title: "Gel Manicure",
      price: "15$",
      chose: false,
      image: service1_3,
    },
    {
      id: "4",
      title: "Gel Pedicure",
      price: "10$",
      chose: false,
      image: service1_4,
    },
  ],
  enhance: [
    {
      id: "5",
      title: "Acrylic Nail Extensions",
      price: "50$",
      chose: false,
      image: extension1,
    },
    {
      id: "6",
      title: "Gel Nail Extensions",
      price: "55$",
      chose: false,
      image: extension2,
    },
    {
      id: "7",
      title: "Silk Wrap Nails",
      price: "45$",
      chose: false,
      image: extension3,
    },
    {
      id: "8",
      title: "SNS Dipping Powder Nails",
      price: "40$",
      chose: false,
      image: extension4,
    },
  ],
  takingOff: [
    {
      id: "9",
      title: "Gel Polish Removal",
      price: "10$",
      chose: false,
      image: taking1,
    },
    {
      id: "10",
      title: "Dip Powder Removal",
      price: "15$",
      chose: false,
      image: taking2,
    },
    {
      id: "11",
      title: "Acrylic Removal",
      price: "20$",
      chose: false,
      image: taking3,
    },
  ],
  waxing: [
    {
      id: "12",
      title: "Eyebrow Waxing",
      price: "12$",
      chose: false,
      image: waxing1,
    },
    {
      id: "13",
      title: "Upper Lip Waxing",
      price: "8$",
      chose: false,
      image: waxing2,
    },
    {
      id: "14",
      title: "Full Face Waxing",
      price: "30$",
      chose: false,
      image: waxing3,
    },
    {
      id: "15",
      title: "Leg Waxing",
      price: "40$",
      chose: false,
      image: waxing4,
    },
  ],
};
