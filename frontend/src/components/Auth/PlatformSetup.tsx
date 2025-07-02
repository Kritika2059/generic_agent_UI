import React, { useState } from 'react';

interface PlatformSetupProps {
  onComplete: (platformData: { [key: string]: string }) => void;
  onBack?: () => void;
  onNavigateToLogin?: () => void;
  userId?: string; // Add userId prop
}

const PlatformSetup: React.FC<PlatformSetupProps> = ({ onComplete, onBack, onNavigateToLogin, userId }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [platformContacts, setPlatformContacts] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'bg-green-500/20', border: 'border-green-500/50' },
    { id: 'linkedin_post', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600/20', border: 'border-blue-600/50' },
    { id: 'discord', name: 'Discord', icon: '🎮', color: 'bg-indigo-600/20', border: 'border-indigo-600/50' },
    { id: 'slack', name: 'Slack', icon: '💬', color: 'bg-purple-600/20', border: 'border-purple-600/50' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-700/20', border: 'border-blue-700/50' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500/20', border: 'border-pink-500/50' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500/20', border: 'border-sky-500/50' },
    { id: 'pdf', name: 'PDF Export', icon: '📄', color: 'bg-red-500/20', border: 'border-red-500/50' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    const newSelected = new Set(selectedPlatforms);
    
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
      // Remove contact when platform is deselected
      const newContacts = { ...platformContacts };
      delete newContacts[platformId];
      setPlatformContacts(newContacts);
    } else {
      newSelected.add(platformId);
    }
    
    setSelectedPlatforms(newSelected);
    setError('');
  };

  const handleContactChange = (platformId: string, contact: string) => {
    setPlatformContacts(prev => ({
      ...prev,
      [platformId]: contact
    }));
  };

  const validateEmailOrPhone = (contact: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/; // More flexible phone format
    const cleanPhone = contact.replace(/[\s\-\(\)]/g, '');
    return emailRegex.test(contact) || phoneRegex.test(contact) || /^[\+]?[\d]{7,15}$/.test(cleanPhone);
  };

  const getInputType = (contact: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(contact) ? 'email' : 'phone';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (selectedPlatforms.size === 0) {
      setError('Please select at least one platform');
      return;
    }

    // Validate contacts for selected platforms
    for (const platformId of selectedPlatforms) {
      const contact = platformContacts[platformId];
      if (!contact || !contact.trim()) {
        setError(`Please enter an email or phone number for ${platforms.find(p => p.id === platformId)?.name}`);
        return;
      }
      if (!validateEmailOrPhone(contact.trim())) {
        setError(`Please enter a valid email or phone number for ${platforms.find(p => p.id === platformId)?.name}`);
        return;
      }
    }

    setLoading(true);
    
    try {
      // Prepare platform data
      const platformData: { [key: string]: string } = {};
      selectedPlatforms.forEach(platformId => {
        platformData[platformId] = platformContacts[platformId].trim();
      });
      
      // Save to database via API
      const response = await fetch('http://localhost:8000/setup-platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, 
          platformData 
        })
      });

      const result = await response.json();

      if (result.success) {
        await onComplete(platformData);
        
        // Navigate to login after successful setup
        if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      } else {
        setError(result.error || 'Failed to save platform settings');
      }
    } catch (err) {
      console.error('Platform setup error:', err);
      setError('Failed to save platform settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Setup Your Platforms</h1>
            <p className="text-blue-100">Choose the platforms you want to use for content generation</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Platform Selection Grid */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Platforms</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="relative">
                      <button
                        type="button"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedPlatforms.has(platform.id)
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 ${platform.color} ${platform.border} border-2 rounded-lg flex items-center justify-center mx-auto mb-2`}
                        >
                          <span className="text-xl">{platform.icon}</span>
                        </div>
                        <h3 className="font-medium text-gray-800 text-sm">{platform.name}</h3>
                        {selectedPlatforms.has(platform.id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Input Fields for Selected Platforms */}
              {selectedPlatforms.size > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Contact Information</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter either an email address or phone number for each platform</p>
                  <div className="space-y-4">
                    {Array.from(selectedPlatforms).map((platformId) => {
                      const platform = platforms.find(p => p.id === platformId);
                      const currentContact = platformContacts[platformId] || '';
                      const contactType = currentContact ? getInputType(currentContact) : 'email';
                      
                      return (
                        <div key={platformId} className="bg-gray-50 p-4 rounded-lg">
                          <label htmlFor={`contact-${platformId}`} className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 ${platform?.color} rounded flex items-center justify-center text-xs`}>
                                {platform?.icon}
                              </span>
                              Contact for {platform?.name}
                              <span className="text-xs text-gray-500">
                                ({contactType === 'email' ? 'Email detected' : 'Phone detected'})
                              </span>
                            </div>
                          </label>
                          <input
                            id={`contact-${platformId}`}
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder={`Enter email or phone for ${platform?.name}`}
                            value={platformContacts[platformId] || ''}
                            onChange={(e) => handleContactChange(platformId, e.target.value)}
                            disabled={loading}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Examples: user@email.com or +1234567890
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading || selectedPlatforms.size === 0}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Setting up...
                    </span>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              </div>

              {/* Platform Count Info */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {selectedPlatforms.size === 0 
                    ? 'Select at least one platform to continue' 
                    : `${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? 's' : ''} selected`
                  }
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSetup;