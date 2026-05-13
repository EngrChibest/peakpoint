import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Paystack Payment Integration Utility
 * @param {Object} options - Payment options
 * @param {string} options.email - User email
 * @param {number} options.amount - Amount in NGN (not Kobo, we multiply here)
 * @param {Object} options.metadata - Custom metadata (userId, feeType, etc.)
 * @param {Function} options.onSuccess - Callback on successful payment
 * @param {Function} options.onCancel - Callback on user cancel
 */
export const initializePayment = ({ email, amount, metadata, onSuccess, onCancel }) => {
  // PAYSTACK_PUBLIC_KEY - Using a placeholder for now. 
  // In a real app, this should be in .env
  const publicKey = 'pk_test_placeholder_for_peak_point'; 

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: email,
    amount: amount * 100, // Paystack works in kobo
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: "User ID",
          variable_name: "user_id",
          value: metadata.userId
        },
        {
          display_name: "Fee Type",
          variable_name: "fee_type",
          value: metadata.feeType
        }
      ],
      ...metadata
    },
    onSuccess: (response) => {
      // Log transaction to Firestore
      addDoc(collection(db, 'payments'), {
        userId: metadata.userId,
        userName: metadata.userName,
        email: email,
        amount: amount,
        feeType: metadata.feeType,
        reference: response.reference,
        status: 'success',
        gateway: 'paystack',
        createdAt: serverTimestamp()
      }).then((transactionRef) => {
        if (onSuccess) onSuccess(response, transactionRef.id);
      }).catch((err) => {
        console.error("Error logging payment:", err);
      });
    },
    callback: function(response) {
      // Support for older Paystack versions
      addDoc(collection(db, 'payments'), {
        userId: metadata.userId,
        userName: metadata.userName,
        email: email,
        amount: amount,
        feeType: metadata.feeType,
        reference: response.reference,
        status: 'success',
        gateway: 'paystack',
        createdAt: serverTimestamp()
      }).then((transactionRef) => {
        if (onSuccess) onSuccess(response, transactionRef.id);
      }).catch((err) => {
        console.error("Error logging payment:", err);
      });
    },
    onClose: () => {
      if (onCancel) onCancel();
    },
    onCancel: () => {
      if (onCancel) onCancel();
    }
  });

  handler.openIframe();
};
