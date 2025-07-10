// settingsController.js
// Controller for application settings-related routes in the backend of the admin portal.
// Handles fetching and updating settings such as notification emails.
// Used by routes/settings.js to process settings requests.

const settingsService = require('../services/settingsService');

// Controller to fetch notification emails from settings
exports.getNotificationEmails = async (req, res) => {
  try {
    // Retrieve notification emails using the settings service
    const emails = await settingsService.getNotificationEmails();
    res.json({ emails }); // Respond with the emails array
  } catch (error) {
    // Log and handle errors
    console.error('Get notification emails error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Controller to save/update notification emails in settings
exports.saveNotificationEmails = async (req, res) => {
  try {
    // Save the provided emails using the settings service
    const result = await settingsService.saveNotificationEmails(req.body.emails);
    res.json(result); // Respond with the result object
  } catch (error) {
    if (error.status) {
      // Handle known validation or business logic errors
      res.status(error.status).json({ success: false, message: error.message, errors: error.details });
    } else {
      // Log and handle unexpected errors
      console.error('Save notification emails error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}; 