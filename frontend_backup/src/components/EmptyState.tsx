import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="bg-farm-light-gray rounded-full p-6 mb-4">
        <Bird className="h-12 w-12 text-farm-text-gray" />
      </div>
      <h3 className="text-lg font-semibold text-farm-brown mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-farm-text-gray text-center max-w-sm mb-4">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
