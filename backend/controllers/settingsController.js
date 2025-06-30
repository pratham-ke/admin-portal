const settingsService = require('../services/settingsService');

exports.getNotificationEmails = async (req, res) => {
  try {
    const emails = await settingsService.getNotificationEmails();
    res.json({ emails });
  } catch (error) {
    console.error('Get notification emails error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.saveNotificationEmails = async (req, res) => {
  try {
    const result = await settingsService.saveNotificationEmails(req.body.emails);
    res.json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ success: false, message: error.message, errors: error.details });
    } else {
      console.error('Save notification emails error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}; 