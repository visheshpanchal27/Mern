import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaGlobe, FaCheck } from 'react-icons/fa'

const Language = () => {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ]

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaGlobe className="mr-2" />
          Language
        </h1>
      </div>
      <div className="p-4 space-y-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <span className="text-white font-medium">{language.name}</span>
            </div>
            {selectedLanguage === language.code && (
              <FaCheck className="text-blue-500" size={16} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Language