import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageShellProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function PageShell({ children, showFooter = true }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
}
