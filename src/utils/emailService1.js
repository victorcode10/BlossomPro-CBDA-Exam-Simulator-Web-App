// Simplified Email Service - Works without EmailJS for now
class EmailService {
  constructor() {
    this.initialized = false;
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(email, name, code) {
    try {
      // For now, we'll just console log and show alert
      // You can add EmailJS later
      console.log(`Verification code for ${email}: ${code}`);
      
      // Store code locally
      this.storeVerificationCode(email, code);
      
      // Show code in alert (for testing - remove in production)
      alert(`Your verification code is: ${code}\n(In production, this will be sent via email)`);
      
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  storeVerificationCode(email, code) {
    const expiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    localStorage.setItem(`verification_${email}`, JSON.stringify({ code, expiry }));
  }

  verifyCode(email, inputCode) {
    const stored = localStorage.getItem(`verification_${email}`);
    if (!stored) return false;

    const { code, expiry } = JSON.parse(stored);
    
    if (Date.now() > expiry) {
      localStorage.removeItem(`verification_${email}`);
      return false;
    }

    if (code === inputCode) {
      localStorage.removeItem(`verification_${email}`);
      return true;
    }

    return false;
  }
}

export default new EmailService();