import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

const PortalLayout = ({ children, role, title, user }) => {
  return (
    <div className="flex min-h-screen bg-bg-soft">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} user={user} />
        
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default PortalLayout;
