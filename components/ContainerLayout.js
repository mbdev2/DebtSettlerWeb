import styles from "../styles/ContainerLayout.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { Head } from "next/head";

const ContainerLayout = ({ children }) => {
  return <motion.div className={styles.container}
  initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2, ease: "easeIn" },
            }}>{children}</motion.div>;
};

export default ContainerLayout;
