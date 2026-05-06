const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '../data');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class GroupManager {
  constructor() {
    this.groups = this.loadGroups();
    this.bannedWords = [
      'dls account for sale',
      'inbox for price',
      'am selling my account',
      'account available',
      'for sale'
    ];
  }

  loadGroups() {
    try {
      if (fs.existsSync(GROUPS_FILE)) {
        return JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading groups:', error.message);
    }
    return {};
  }

  saveGroups() {
    try {
      fs.writeFileSync(GROUPS_FILE, JSON.stringify(this.groups, null, 2));
    } catch (error) {
      console.error('Error saving groups:', error.message);
    }
  }

  getGroup(groupId) {
    if (!this.groups[groupId]) {
      this.groups[groupId] = { id: groupId, warnings: {}, admins: [], createdAt: new Date().toISOString() };
      this.saveGroups();
    }
    return this.groups[groupId];
  }

  setAdmins(groupId, adminNumbers) {
    this.getGroup(groupId).admins = adminNumbers;
    this.saveGroups();
  }

  addWarning(groupId, memberId) {
    const group = this.getGroup(groupId);
    if (!group.warnings[memberId]) {
      group.warnings[memberId] = { count: 0, lastWarned: null };
    }
    group.warnings[memberId].count += 1;
    group.warnings[memberId].lastWarned = new Date().toISOString();
    this.saveGroups();
    return group.warnings[memberId].count;
  }

  getWarnings(groupId, memberId) {
    const group = this.getGroup(groupId);
    return group.warnings[memberId] ? group.warnings[memberId].count : 0;
  }

  isAdmin(groupId, userId) {
    return this.getGroup(groupId).admins.includes(userId);
  }

  containsLink(message) {
    return /(https?:\/\/|www\.|ftp:\/\/|viber:\/\/|telegram:\/\/)/i.test(message);
  }

  containsBannedWords(message) {
    const lowerMessage = message.toLowerCase();
    for (const word of this.bannedWords) {
      if (lowerMessage.includes(word.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  getBannedWord(message) {
    const lowerMessage = message.toLowerCase();
    for (const word of this.bannedWords) {
      if (lowerMessage.includes(word.toLowerCase())) {
        return word;
      }
    }
    return null;
  }
}

module.exports = GroupManager;