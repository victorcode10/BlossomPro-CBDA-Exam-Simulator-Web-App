// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: 'blossompro_2025', // From EmailJS dashboard
  templateId: 'template_rkew25t', // From EmailJS dashboard
  publicKey: 'Bp7a6FffZ4DfBOqY3' // From EmailJS dashboard
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