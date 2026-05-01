function buildFeedbackState(req) {
  return {
    message: req.query.message || null,
    messageType: req.query.type === "error" ? "error" : "success",
  };
}

function buildRedirectPath(basePath, message, type = "success") {
  const params = new URLSearchParams({ message, type });
  return `${basePath}?${params.toString()}`;
}

class ViewController {
  static async renderHome(req, res) {
    try {
    } catch (err) {}
  }
}

module.exports = ViewController;
