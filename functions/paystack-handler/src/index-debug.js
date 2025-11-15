// Minimal diagnostic version to identify the crash
module.exports = async (req, res) => {
  try {
    // Test 1: Can we return anything?
    console.log('Function started');
    
    // Test 2: Can we access req?
    const hasVariables = req.variables ? 'yes' : 'no';
    const hasPayload = req.payload ? 'yes' : 'no';
    
    // Test 3: Can we require dependencies?
    let axiosLoaded = 'no';
    let sdkLoaded = 'no';
    
    try {
      require('axios');
      axiosLoaded = 'yes';
    } catch (e) {
      axiosLoaded = `error: ${e.message}`;
    }
    
    try {
      require('node-appwrite');
      sdkLoaded = 'yes';
    } catch (e) {
      sdkLoaded = `error: ${e.message}`;
    }
    
    // Test 4: Check env vars
    const secretKey = req.variables?.PAYSTACK_SECRET_KEY ? 'set' : 'missing';
    
    return res.json({
      success: true,
      diagnostics: {
        functionStarted: true,
        hasVariables,
        hasPayload,
        axiosLoaded,
        sdkLoaded,
        secretKey,
        nodeVersion: process.version,
      }
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return res.json({
      success: false,
      error: error.toString(),
      message: error.message,
      stack: error.stack,
    }, 500);
  }
};
