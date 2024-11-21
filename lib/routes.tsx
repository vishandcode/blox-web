import { MdDashboard } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { GrTransaction } from "react-icons/gr";
import { FaBoxes } from "react-icons/fa";

export const Routes = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard />,
  },

  {
    title: "Products",
    href: "/products",
    icon: <FaBoxes />,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: <GrTransaction />,
  },
  {
    title: "Account",
    href: "/account",
    icon: <RiAccountBoxFill />,
  },
];
