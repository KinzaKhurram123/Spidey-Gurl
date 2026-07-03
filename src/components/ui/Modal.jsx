import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className={`glass relative z-10 w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-xl2 p-6`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-heading text-xl text-white">{title}</h3>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
