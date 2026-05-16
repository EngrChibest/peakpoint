import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Dynamically loads the Paystack script if not already present
 * @returns {Promise} Resolves when script is loaded
 */
const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Paystack SDK could not be loaded. Please check your internet connection.'));
    document.head.appendChild(script);
  });
};

/**
 * Paystack Payment Integration Utility
 * @param {Object} options - Payment options
 */
export const initializePayment = async ({ email, amount, metadata, onSuccess, onCancel, onError }) => {
  try {
    // 1. Ensure Paystack is loaded
    await loadPaystackScript();

    if (!window.PaystackPop) {
      throw new Error('Paystack gateway is currently unavailable.');
    }

    // PAYSTACK_PUBLIC_KEY - Using a placeholder for now. 
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
      onClose: () => {
        if (onCancel) onCancel();
      },
      onCancel: () => {
        if (onCancel) onCancel();
      }
    });

    handler.openIframe();
  } catch (err) {
    console.error("Payment Initialization Error:", err);
    if (onError) {
      onError(err.message);
    } else {
      alert("Institutional Payment Error: " + err.message);
    }
  }
};
