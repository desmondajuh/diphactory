import { motion } from "motion/react";

export const SubmitButton = ({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) => (
  <motion.button
    whileTap={{ scale: 0.99 }}
    className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl
               bg-accent-red py-3.5 font-display text-lg
               tracking-wide text-white transition-colors hover:bg-red-600"
  >
    {label}
    {icon}
  </motion.button>
);
