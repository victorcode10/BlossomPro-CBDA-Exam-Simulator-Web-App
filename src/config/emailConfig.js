// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

// Email templates
export const EMAIL_TEMPLATES = {
  verification: {
    subject: 'Verify Your CBDA Exam Account',
    getBody: (name, code) => `
      Hi ${name},
      
      Welcome to CBDA Exam Simulator!
      
      Your verification code is: ${code}
      
      Please enter this code to complete your registration.
      
      This code expires in 15 minutes.
      
      Best regards,
      Blossom Academy Team
    `
  },
  adminVerification: {
    subject: 'Admin Account Verification - CBDA',
    getBody: (name, code) => `
      Hi ${name},
      
      Admin account verification request.
      
      Your verification code is: ${code}
      
      This code expires in 15 minutes.
      
      Best regards,
      Blossom Academy Team
    `
  },
  emailChange: {
    subject: 'Verify Your New Email Address',
    getBody: (name, code) => `
      Hi ${name},
      
      You requested to change your email address.
      
      Verification code: ${code}
      
      This code expires in 15 minutes.
      
      Best regards,
      Blossom Academy Team
    `
  }
};