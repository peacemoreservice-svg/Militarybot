const GroupManager = require('./group-manager');
const manager = new GroupManager();

class GroupHandler {
  static async handleGroupMessage(message, client) {
    if (!message.isGroup) return;

    const groupId = message.from;
    const senderId = message.author;
    const messageText = message.body;

    try {
      const chat = await message.getChat();
      manager.getGroup(groupId);
      const adminNumbers = chat.participants.filter(p => p.isAdmin).map(p => p.id._serialized);
      manager.setAdmins(groupId, adminNumbers);
      const isAdmin = manager.isAdmin(groupId, senderId);

      // Check for links
      if (manager.containsLink(messageText)) {
        if (!isAdmin) {
          await message.delete(true);
          const warningCount = manager.addWarning(groupId, senderId);
          let warningMessage = '';
          if (warningCount === 1) warningMessage = '⚠️ No links allowed except by admins. (Warning 1/4)';
          else if (warningCount === 2) warningMessage = '⚠️ Please stop posting links. (Warning 2/4)';
          else if (warningCount === 3) warningMessage = '⚠️ One more warning and you will be removed. (Warning 3/4)';
          else if (warningCount >= 4) {
            warningMessage = '🚫 You have been removed from the group (4 warnings).';
            setTimeout(async () => {
              try {
                await chat.removeParticipants([senderId]);
              } catch (error) {
                console.error('Error removing member:', error.message);
              }
            }, 2000);
          }
          if (warningMessage) await message.reply(warningMessage);
        }
      }

      // Check for banned words
      if (manager.containsBannedWords(messageText)) {
        if (!isAdmin) {
          await message.delete(true);
          const bannedWord = manager.getBannedWord(messageText);
          const warningCount = manager.addWarning(groupId, senderId);
          let warningMessage = '';
          if (warningCount === 1) warningMessage = `⚠️ "${bannedWord}" is not allowed. (Warning 1/4)`;
          else if (warningCount === 2) warningMessage = `⚠️ Stop posting banned content. (Warning 2/4)`;
          else if (warningCount === 3) warningMessage = `⚠️ One more warning and you will be removed. (Warning 3/4)`;
          else if (warningCount >= 4) {
            warningMessage = '🚫 You have been removed from the group (4 warnings).';
            setTimeout(async () => {
              try {
                await chat.removeParticipants([senderId]);
              } catch (error) {
                console.error('Error removing member:', error.message);
              }
            }, 2000);
          }
          if (warningMessage) await message.reply(warningMessage);
        }
      }

      // Check for group mentions in status
      if (manager.containsGroupMention(messageText)) {
        if (!isAdmin) {
          await message.delete(true);
          const groupMention = manager.getGroupMention(messageText);
          const warningCount = manager.addWarning(groupId, senderId);
          let warningMessage = '';
          if (warningCount === 1) warningMessage = `⚠️ Group promotion not allowed. (Warning 1/4)`;
          else if (warningCount === 2) warningMessage = `⚠️ Stop promoting groups. (Warning 2/4)`;
          else if (warningCount === 3) warningMessage = `⚠️ One more warning and you will be removed. (Warning 3/4)`;
          else if (warningCount >= 4) {
            warningMessage = '🚫 You have been removed from the group (4 warnings).';
            setTimeout(async () => {
              try {
                await chat.removeParticipants([senderId]);
              } catch (error) {
                console.error('Error removing member:', error.message);
              }
            }, 2000);
          }
          if (warningMessage) await message.reply(warningMessage);
        }
      }
    } catch (error) {
      console.error('Error handling group message:', error.message);
    }
  }
}

module.exports = GroupHandler;