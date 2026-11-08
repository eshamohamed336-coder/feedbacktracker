/**
 * Exclusive Business Owner Authentication & Data Service
 */

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_SECONDS = 60;
const STORAGE_KEY_OWNER = 'bizfeedback_owner_auth';
const STORAGE_KEY_AUDIT_LOGS = 'bizfeedback_security_audit_logs';
const STORAGE_KEY_RATINGS = 'bizfeedback_ratings_data';
const STORAGE_KEY_FEEDBACK = 'bizfeedback_feedback_data';

const DEFAULT_OWNER_ACCOUNT = {
  email: 'owner@bizfeedback.com',
  password: 'OwnerPass2026!',
  name: 'Store Owner',
  role: 'Business Owner',
  businessName: 'BizFeedback Store #9042',
  failedAttempts: 0,
  lockedUntil: null,
  registeredDate: '2026-01-15'
};

// --- Ratings Dataset (with real ISO dates for filtering) ---
const DEFAULT_RATINGS = [
  { id: 1, customer: 'Rahul Sharma',  avatar: 'RS', avatarBg: '#6366f1', rating: 5, comment: 'Great platform! Very easy to use and helpful.',          date: '2026-11-08', source: 'Google Review',   feedbackStatus: 'Positive' },
  { id: 2, customer: 'Priya Kumar',   avatar: 'PK', avatarBg: '#7c3aed', rating: 4, comment: 'Good features. Need more payment options.',              date: '2026-11-08', source: 'Store QR Code',  feedbackStatus: 'Neutral'  },
  { id: 3, customer: 'Arun Kumar',    avatar: 'AK', avatarBg: '#6366f1', rating: 5, comment: 'Excellent service and support!',                         date: '2026-11-07', source: 'Direct Feedback', feedbackStatus: 'Positive' },
  { id: 4, customer: 'Sneha Iyer',    avatar: 'SI', avatarBg: '#7c3aed', rating: 4, comment: 'Nice app. Easy to use.',                                 date: '2026-11-06', source: 'Store QR Code',  feedbackStatus: 'Positive' },
  { id: 5, customer: 'Vikram Patel',  avatar: 'VP', avatarBg: '#2563eb', rating: 5, comment: 'Prompt delivery and top-notch packaging. Recommended!',  date: '2026-11-05', source: 'Store QR Code',  feedbackStatus: 'Positive' },
  { id: 6, customer: 'Meera Nair',    avatar: 'MN', avatarBg: '#0891b2', rating: 3, comment: 'Average experience. Could be improved.',                 date: '2026-11-04', source: 'Direct Feedback', feedbackStatus: 'Neutral'  },
  { id: 7, customer: 'Ravi Shankar',  avatar: 'RV', avatarBg: '#059669', rating: 5, comment: 'Absolutely love the owner dashboard!',                   date: '2026-11-03', source: 'Google Review',   feedbackStatus: 'Positive' },
  { id: 8, customer: 'Kiran Das',     avatar: 'KD', avatarBg: '#dc2626', rating: 2, comment: 'Faced issues with the billing section.',                 date: '2026-11-02', source: 'Store QR Code',  feedbackStatus: 'Negative' },
  { id: 9, customer: 'Ananya Singh',  avatar: 'AN', avatarBg: '#6366f1', rating: 5, comment: 'Staff is very courteous and helpful every time!',        date: '2026-11-01', source: 'Google Review',   feedbackStatus: 'Positive' },
  { id: 10, customer: 'Deepak Raj',   avatar: 'DR', avatarBg: '#7c3aed', rating: 4, comment: 'Good experience overall. Will visit again.',              date: '2026-10-30', source: 'Direct Feedback', feedbackStatus: 'Positive' },
  { id: 11, customer: 'Lakshmi Devi', avatar: 'LD', avatarBg: '#0891b2', rating: 5, comment: 'Outstanding ambiance and service quality!',               date: '2026-10-28', source: 'Store QR Code',  feedbackStatus: 'Positive' },
  { id: 12, customer: 'Suresh Babu',  avatar: 'SB', avatarBg: '#059669', rating: 3, comment: 'Acceptable, but checkout process was slow.',              date: '2026-10-25', source: 'Store QR Code',  feedbackStatus: 'Neutral'  },
  { id: 13, customer: 'Pooja Mehta',  avatar: 'PM', avatarBg: '#7c3aed', rating: 1, comment: 'Very disappointing. Order was wrong.',                   date: '2026-10-20', source: 'Direct Feedback', feedbackStatus: 'Negative' },
  { id: 14, customer: 'Gaurav Joshi', avatar: 'GJ', avatarBg: '#6366f1', rating: 5, comment: 'Fantastic service every single time! 10/10.',             date: '2026-10-15', source: 'Google Review',   feedbackStatus: 'Positive' },
  { id: 15, customer: 'Nisha Patel',  avatar: 'NP', avatarBg: '#2563eb', rating: 4, comment: 'Very satisfied. Friendly and fast service.',              date: '2026-10-10', source: 'Store QR Code',  feedbackStatus: 'Positive' },
];

// --- Feedback Dataset (separate from ratings — text feedback with status management) ---
const DEFAULT_FEEDBACK = [
  {
    id: 1, customer: 'Aarav Sharma', avatar: 'AS', avatarBg: '#6366f1',
    rating: 5, subject: 'Excellent Owner Service', date: '2026-11-08',
    source: 'Store QR Code', tags: ['Fast Service', 'Friendly Staff'],
    comment: 'Exceptional service and friendly staff! The ambiance was delightful and everything was prompt. Will definitely return!',
    status: 'Resolved', feedbackType: 'Positive',
    ownerReply: 'Thank you Aarav! We appreciate your wonderful feedback and hope to see you again soon.'
  },
  {
    id: 2, customer: 'Priya Raman', avatar: 'PR', avatarBg: '#7c3aed',
    rating: 5, subject: 'Super Fast Billing', date: '2026-11-08',
    source: 'Google Review', tags: ['Clean Store', 'High Quality'],
    comment: 'Super fast billing and clean store. My favorite place in the city! The staff is always smiling and helpful.',
    status: 'Reviewed', feedbackType: 'Positive',
    ownerReply: null
  },
  {
    id: 3, customer: 'Karthik Subramanian', avatar: 'KS', avatarBg: '#059669',
    rating: 4, subject: 'Need More Dessert Options', date: '2026-11-07',
    source: 'Direct Feedback', tags: ['Great Value'],
    comment: 'Good overall quality. Would love to see more dessert options next time. The staff was courteous throughout.',
    status: 'Pending', feedbackType: 'Positive',
    ownerReply: null
  },
  {
    id: 4, customer: 'Divya Venkatesh', avatar: 'DV', avatarBg: '#0891b2',
    rating: 5, subject: 'Owner\'s Personal Attention', date: '2026-11-06',
    source: 'Store QR Code', tags: ['Friendly Staff', 'Great Ambiance'],
    comment: 'Great management! The owner personally ensured our order was taken care of. Very impressive dedication!',
    status: 'Resolved', feedbackType: 'Positive',
    ownerReply: 'Thank you Divya for your kind words! Always our pleasure.'
  },
  {
    id: 5, customer: 'Rajesh Kumar', avatar: 'RK', avatarBg: '#dc2626',
    rating: 3, subject: 'Long Queue in Evenings', date: '2026-11-05',
    source: 'Store QR Code', tags: ['Slow Queue'],
    comment: 'Products are good, but the queue was slightly long during evening rush hours. Hope this gets resolved soon.',
    status: 'Pending', feedbackType: 'Neutral',
    ownerReply: null
  },
  {
    id: 6, customer: 'Meera Nair', avatar: 'MN', avatarBg: '#7c3aed',
    rating: 2, subject: 'Billing Error Faced', date: '2026-11-04',
    source: 'Direct Feedback', tags: ['Billing Issue'],
    comment: 'Faced a billing discrepancy in my last visit. The staff tried to fix it but it took way too long. Very inconvenient.',
    status: 'Reviewed', feedbackType: 'Negative',
    ownerReply: null
  },
  {
    id: 7, customer: 'Vikram Patel', avatar: 'VP', avatarBg: '#6366f1',
    rating: 5, subject: 'Outstanding Experience!', date: '2026-11-03',
    source: 'Google Review', tags: ['Fast Service', 'Clean Store'],
    comment: 'Prompt delivery and top-notch packaging. Recommended to all my friends and family! Will definitely come back.',
    status: 'Resolved', feedbackType: 'Positive',
    ownerReply: 'Thank you Vikram! We\'re so happy you had a great experience.'
  },
  {
    id: 8, customer: 'Pooja Mehta', avatar: 'PM', avatarBg: '#dc2626',
    rating: 1, subject: 'Incorrect Order Delivered', date: '2026-10-30',
    source: 'Direct Feedback', tags: ['Wrong Order', 'Complaint'],
    comment: 'Very disappointing visit. My order was completely wrong and the refund process took 3 days. This needs to be fixed urgently.',
    status: 'Pending', feedbackType: 'Negative',
    ownerReply: null
  },
];

// --- Trend data per month (for chart rendering) ---
export const MONTHLY_TREND_DATA = {
  '1month':  { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [4.3, 4.5, 4.4, 4.6] },
  '3months': { labels: ['Sep', 'Oct', 'Nov'], values: [4.3, 4.5, 4.6] },
  '6months': { labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], values: [4.1, 4.2, 4.3, 4.5, 4.6, 4.6] },
  '1year':   { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: [3.8, 3.9, 4.0, 4.1, 4.2, 4.1, 4.2, 4.3, 4.5, 4.6, 4.6, null] }
};

class AuthService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      if (!localStorage.getItem(STORAGE_KEY_OWNER)) {
        localStorage.setItem(STORAGE_KEY_OWNER, JSON.stringify(DEFAULT_OWNER_ACCOUNT));
      }
      if (!localStorage.getItem(STORAGE_KEY_AUDIT_LOGS)) {
        localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEY_RATINGS)) {
        localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(DEFAULT_RATINGS));
      }
      if (!localStorage.getItem(STORAGE_KEY_FEEDBACK)) {
        localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(DEFAULT_FEEDBACK));
      }
    } catch {}
  }

  getOwner() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OWNER);
      return stored ? JSON.parse(stored) : DEFAULT_OWNER_ACCOUNT;
    } catch { return DEFAULT_OWNER_ACCOUNT; }
  }

  saveOwner(owner) {
    try { localStorage.setItem(STORAGE_KEY_OWNER, JSON.stringify(owner)); } catch {}
  }

  logSecurityEvent(email, eventType, status, details = '') {
    try {
      const logs = this.getAuditLogs();
      const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 6),
        timestamp: new Date().toISOString(),
        timeDisplay: new Date().toLocaleTimeString(),
        email: email || 'Unknown',
        eventType, status, details,
        userAgent: navigator.userAgent.substring(0, 48) + '...'
      };
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify([entry, ...logs.slice(0, 49)]));
      return entry;
    } catch { return null; }
  }

  getAuditLogs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT_LOGS) || '[]'); }
    catch { return []; }
  }

  getLockoutStatus(email) {
    const owner = this.getOwner();
    if (owner.email.toLowerCase() !== (email || '').trim().toLowerCase()) {
      return { isLocked: false, remainingSeconds: 0 };
    }
    if (owner.lockedUntil) {
      const now = Date.now();
      if (now < owner.lockedUntil) {
        return { isLocked: true, remainingSeconds: Math.ceil((owner.lockedUntil - now) / 1000), failedAttempts: owner.failedAttempts };
      }
      owner.lockedUntil = null;
      owner.failedAttempts = 0;
      this.saveOwner(owner);
      this.logSecurityEvent(owner.email, 'ACCOUNT_AUTO_UNLOCKED', 'SUCCESS', 'Lockout expired. Access restored.');
    }
    return { isLocked: false, remainingSeconds: 0, failedAttempts: owner.failedAttempts || 0 };
  }

  unlockAccount() {
    const owner = this.getOwner();
    owner.lockedUntil = null;
    owner.failedAttempts = 0;
    this.saveOwner(owner);
    this.logSecurityEvent(owner.email, 'ACCOUNT_UNLOCKED', 'SUCCESS', 'Manual security reset performed.');
  }

  async login(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    await new Promise(resolve => setTimeout(resolve, 550));
    const owner = this.getOwner();

    if (owner.email.toLowerCase() !== normalizedEmail) {
      this.logSecurityEvent(email, 'UNAUTHORIZED_NON_OWNER', 'WARNING', 'Unauthorized access attempt. Only Business Owner permitted.');
      return { success: false, errorType: 'INVALID_EMAIL', title: 'Access Restricted to Owner Only', message: 'This login portal is strictly reserved for the Business Owner. There are no user or admin logins permitted.' };
    }

    const now = Date.now();
    if (owner.lockedUntil && now < owner.lockedUntil) {
      const remainingSeconds = Math.ceil((owner.lockedUntil - now) / 1000);
      this.logSecurityEvent(owner.email, 'BLOCKED_ATTEMPT_LOCKED_ACCOUNT', 'BLOCKED', `Access denied. Account locked. ${remainingSeconds}s remaining.`);
      return { success: false, errorType: 'ACCOUNT_LOCKED', title: 'Owner Account Temporarily Locked', message: 'Owner account is temporarily locked. Please wait for the security countdown.', remainingSeconds, isLocked: true };
    }

    if (owner.password !== password) {
      const newFailedCount = (owner.failedAttempts || 0) + 1;
      owner.failedAttempts = newFailedCount;
      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        owner.lockedUntil = now + (LOCKOUT_DURATION_SECONDS * 1000);
        this.saveOwner(owner);
        this.logSecurityEvent(owner.email, 'ACCOUNT_LOCKED', 'BLOCKED', `Locked for ${LOCKOUT_DURATION_SECONDS}s after ${MAX_FAILED_ATTEMPTS} failed attempts.`);
        return { success: false, errorType: 'ACCOUNT_LOCKED', title: 'Owner Account Locked', message: `Too many failed attempts. This portal is locked for ${LOCKOUT_DURATION_SECONDS} seconds.`, remainingSeconds: LOCKOUT_DURATION_SECONDS, isLocked: true, failedAttempts: newFailedCount };
      }
      this.saveOwner(owner);
      const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedCount;
      this.logSecurityEvent(owner.email, 'INVALID_PASSWORD', 'WARNING', `Failed attempt (${newFailedCount}/${MAX_FAILED_ATTEMPTS}). ${remainingAttempts} remaining.`);
      return { success: false, errorType: 'INVALID_PASSWORD', title: 'Incorrect Owner Password', message: `The password is incorrect. You have ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} left before lockout.`, remainingAttempts, failedAttempts: newFailedCount, maxAttempts: MAX_FAILED_ATTEMPTS };
    }

    owner.failedAttempts = 0;
    owner.lockedUntil = null;
    owner.lastLogin = new Date().toISOString();
    this.saveOwner(owner);
    this.logSecurityEvent(owner.email, 'OWNER_LOGIN_SUCCESS', 'SUCCESS', `Business Owner authenticated. Dashboard granted.`);
    return { success: true, user: { email: owner.email, name: owner.name, role: owner.role, businessName: owner.businessName, lastLogin: owner.lastLogin } };
  }

  // ─── RATINGS ───────────────────────────────────────────────────────────────
  getRatings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RATINGS) || 'null') || DEFAULT_RATINGS; }
    catch { return DEFAULT_RATINGS; }
  }

  saveRatings(ratings) {
    try { localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratings)); } catch {}
  }

  addRating(data) {
    const ratings = this.getRatings();
    const initials = (data.customer || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#6366f1','#7c3aed','#2563eb','#0891b2','#059669'];
    const newEntry = {
      id: Date.now(),
      customer: data.customer || 'Walk-in Customer',
      avatar: initials,
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      rating: Number(data.rating) || 5,
      comment: data.comment || '',
      date: data.date || new Date().toISOString().split('T')[0],
      source: data.source || 'Store QR Code',
      feedbackStatus: data.rating >= 4 ? 'Positive' : data.rating === 3 ? 'Neutral' : 'Negative'
    };
    const updated = [newEntry, ...ratings];
    this.saveRatings(updated);
    return newEntry;
  }

  // ─── FEEDBACK ───────────────────────────────────────────────────────────────
  getFeedback() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_FEEDBACK) || 'null') || DEFAULT_FEEDBACK; }
    catch { return DEFAULT_FEEDBACK; }
  }

  saveFeedback(feedback) {
    try { localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(feedback)); } catch {}
  }

  updateFeedbackStatus(feedbackId, newStatus) {
    const list = this.getFeedback();
    const updated = list.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f);
    this.saveFeedback(updated);
    return updated;
  }

  replyToFeedback(feedbackId, replyText) {
    const list = this.getFeedback();
    const updated = list.map(f => f.id === feedbackId ? { ...f, ownerReply: replyText, status: 'Resolved' } : f);
    this.saveFeedback(updated);
    return updated;
  }

  addFeedback(data) {
    const list = this.getFeedback();
    const initials = (data.customer || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#6366f1','#7c3aed','#2563eb','#0891b2','#059669'];
    const newEntry = {
      id: Date.now(),
      customer: data.customer || 'Walk-in Customer',
      avatar: initials,
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      rating: Number(data.rating) || 5,
      subject: data.subject || 'Customer Feedback',
      date: data.date || new Date().toISOString().split('T')[0],
      source: data.source || 'Store QR Code',
      tags: data.tags || ['Verified'],
      comment: data.comment || '',
      status: 'Pending',
      feedbackType: data.rating >= 4 ? 'Positive' : data.rating === 3 ? 'Neutral' : 'Negative',
      ownerReply: null
    };
    const updated = [newEntry, ...list];
    this.saveFeedback(updated);
    return newEntry;
  }

  replyToFeedback(feedbackId, replyText) {
    const list = this.getFeedback();
    const updated = list.map(f => f.id === feedbackId ? { ...f, ownerReply: replyText, status: 'Resolved' } : f);
    this.saveFeedback(updated);
    return updated;
  }

  addFeedback(data) {
    const list = this.getFeedback();
    const initials = (data.customer || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#6366f1','#7c3aed','#2563eb','#0891b2','#059669'];
    const newEntry = {
      id: Date.now(),
      customer: data.customer || 'Walk-in Customer',
      avatar: initials,
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      rating: Number(data.rating) || 5,
      subject: data.subject || 'Customer Feedback',
      date: data.date || new Date().toISOString().split('T')[0],
      source: data.source || 'Store QR Code',
      tags: data.tags || ['Verified'],
      comment: data.comment || '',
      status: 'Pending',
      feedbackType: data.rating >= 4 ? 'Positive' : data.rating === 3 ? 'Neutral' : 'Negative',
      ownerReply: null
    };
    const updated = [newEntry, ...list];
    this.saveFeedback(updated);
    return newEntry;
  }

  resetAllData() {
    this.saveOwner(DEFAULT_OWNER_ACCOUNT);
    try {
      localStorage.removeItem(STORAGE_KEY_AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEY_RATINGS);
      localStorage.removeItem(STORAGE_KEY_FEEDBACK);
    } catch {}
    this.initStorage();
  }
}

export const authService = new AuthService();
export { MAX_FAILED_ATTEMPTS, LOCKOUT_DURATION_SECONDS };
