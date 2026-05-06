/**
 * Phone Number Authentication for WhatsApp
 * Alternative to QR code for Pella deployment
 */

const fs = require('fs');
const path = require('path');

const SESSION_DIR = path.join(__dirname, '../.wwebjs_auth');

class PhoneAuthenticator {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.sessionFile = path.join(SESSION_DIR, 'phone_session.json');
  }

  /**
   * Initialize authentication with phone number
   */
  async initialize() {
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    if (this.sessionExists()) {
      console.log('Existing session found for:', this.phoneNumber);
      return this.loadSession();
    }

    console.log('No existing session. Starting phone number authentication...');
    return this.createSession();
  }

  /**
   * Check if session file exists
   */
  sessionExists() {
    return fs.existsSync(this.sessionFile);
  }

  /**
   * Load existing session
   */
  loadSession() {
    try {
      const sessionData = fs.readFileSync(this.sessionFile, 'utf8');
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Error loading session:', error.message);
      return null;
    }
  }

  /**
   * Create new session with phone number
   */
  async createSession() {
    const session = {
      phoneNumber: this.phoneNumber,
      createdAt: new Date().toISOString(),
      authenticated: false
    };

    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
      console.log('Session file created for phone:', this.phoneNumber);
      return session;
    } catch (error) {
      console.error('Error creating session:', error.message);
      throw error;
    }
  }

  /**
   * Update session after successful authentication
   */
  updateSession(data) {
    const session = {
      phoneNumber: this.phoneNumber,
      createdAt: new Date().toISOString(),
      authenticated: true,
      ...data
    };

    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
      console.log('Session updated for phone:', this.phoneNumber);
    } catch (error) {
      console.error('Error updating session:', error.message);
    }
  }

  /**
   * Clear session
   */
  clearSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        fs.unlinkSync(this.sessionFile);
        console.log('Session cleared for phone:', this.phoneNumber);
      }
    } catch (error) {
      console.error('Error clearing session:', error.message);
    }
  }
}

module.exports = PhoneAuthenticator;
