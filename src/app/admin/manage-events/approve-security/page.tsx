'use client';
import { useEvents, useUser } from '@/lib/stores';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { acceptSecurity, rejectSecurity } from '@/utils/functions';
import { toast } from 'sonner';

// Define types
interface SecurityItem {
  id: number;
  user_id: string;
  name?: string;
  requester_email: string;
  created_at: string;
}

const SecuritiesPage = () => {
  const { securitiesData, getSecuritiesData, securitiesLoading } = useEvents();
  const { userData } = useUser();
  const [statusMap, setStatusMap] = useState<Record<number, 'accepted' | 'rejected' | null>>({});
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    if (userData?.id) {
      getSecuritiesData(userData.id);
    }
  }, [userData?.id, getSecuritiesData]);

  const handleAccept = async (id: number, userId: string) => {
    // Set processing state
    setProcessingIds(prev => [...prev, id]);
    
    try {
      await acceptSecurity(userId);
      setStatusMap(prev => ({ ...prev, [id]: 'accepted' }));
      toast.success('Security request accepted');
      
      // Update the store by removing the accepted request
      // This assumes getSecuritiesData will refetch the data
      if (userData?.id) {
        setTimeout(() => {
          getSecuritiesData(userData.id);
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to accept security request');
      console.error('Error accepting security:', error);
    } finally {
      setProcessingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleReject = async (id: number, userId: string) => {
    // Set processing state
    setProcessingIds(prev => [...prev, id]);
    
    try {
      await rejectSecurity(userId);
      setStatusMap(prev => ({ ...prev, [id]: 'rejected' }));
      toast.success('Security request rejected');
      
      // Update the store by removing the rejected request
      if (userData?.id) {
        setTimeout(() => {
          getSecuritiesData(userData.id);
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to reject security request');
      console.error('Error rejecting security:', error);
    } finally {
      setProcessingIds(prev => prev.filter(item => item !== id));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-[#210000] to-[#370000] min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-yellow-200 text-center"
      >
        Securities Requests
      </motion.h1>
      
      {/* Decorative element */}
      <motion.div 
        className="w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent mx-auto mb-10"
        animate={{ scaleX: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {securitiesLoading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-200"
          />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="overflow-x-auto rounded-lg shadow-2xl shadow-yellow-200/10 border-2 border-yellow-200/40"
        >
          {securitiesData && securitiesData.length > 0 ? (
            <table className="min-w-full bg-[#210000]">
              <thead>
                <tr className="border-b-2 border-yellow-200/30">
                  <th className="py-4 px-4 text-left text-sm font-medium text-yellow-200/90">ID</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-yellow-200/90">Name</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-yellow-200/90">Email</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-yellow-200/90">Created At</th>
                  <th className="py-4 px-4 text-center text-sm font-medium text-yellow-200/90">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-200/20">
                {securitiesData.map((item: SecurityItem) => {
                  const isProcessing = processingIds.includes(item.id);
                  return (
                    <motion.tr 
                      key={item.id}
                      whileHover={{ scale: 1.01, backgroundColor: "rgba(254, 240, 138, 0.07)" }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <td className="py-3 px-4 text-sm text-yellow-200/80">{item.id}</td>
                      <td className="py-3 px-4 text-sm text-yellow-200/80">{item.name || 'No Name'}</td>
                      <td className="py-3 px-4 text-sm text-yellow-200/80">{item.requester_email}</td>
                      <td className="py-3 px-4 text-sm text-yellow-200/80">{formatDate(item.created_at)}</td>
                      <td className="py-3 px-4 flex justify-center space-x-3">
                        {statusMap[item.id] ? (
                          <div className={`py-2 px-4 rounded-md text-sm font-medium ${
                            statusMap[item.id] === 'accepted' 
                              ? 'bg-green-900/50 text-green-300' 
                              : 'bg-red-900/50 text-red-300'
                          }`}>
                            {statusMap[item.id] === 'accepted' ? 'Accepted' : 'Rejected'}
                          </div>
                        ) : isProcessing ? (
                          <div className="flex items-center justify-center gap-2 py-2 px-4">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-200"
                            />
                            <span className="text-yellow-200/80">Processing...</span>
                          </div>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAccept(item.id, item.user_id)}
                              className="flex items-center justify-center gap-2 py-2 px-4 bg-green-900/40 hover:bg-green-800/60 text-green-200 rounded-md transition-colors duration-300 border border-green-200/30"
                              disabled={isProcessing}
                            >
                              <FaCheck size={12} />
                              <span>Accept</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(item.id, item.user_id)}
                              className="flex items-center justify-center gap-2 py-2 px-4 bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded-md transition-colors duration-300 border border-red-200/30"
                              disabled={isProcessing}
                            >
                              <FaTimes size={12} />
                              <span>Reject</span>
                            </motion.button>
                          </>
                        )}
                      </td>
                      {/* Animated particle effects on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute bg-yellow-200 rounded-full"
                            style={{
                              width: Math.random() * 6 + 2,
                              height: Math.random() * 6 + 2,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0, 0.8, 0],
                            }}
                            transition={{
                              duration: Math.random() * 2 + 1,
                              repeat: Infinity,
                              delay: Math.random() * 1,
                            }}
                          />
                        ))}
                      </div>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center py-16 text-yellow-200/80">
              <p>No security requests found</p>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Bottom decorative element */}
      <div className="w-full h-6 relative overflow-hidden mt-12">
        <motion.div
          className="absolute inset-0 flex justify-between items-center px-4"
          animate={{ x: [-20, 0, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-yellow-200/30" />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SecuritiesPage;