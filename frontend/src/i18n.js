import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Landing Page
      "welcome": "Welcome to SafeStep!",
      "getStarted": "Get Started",
      "goToDashboard": "Go to Dashboard",
      "signIn": "Sign In",
      "emergency": "Emergency: 911",
      "staySafe": "Stay Safe,",
      "stayConnected": "Stay Connected",
      "heroSubtitle": "One tap sends your location to trusted contacts when you need help most.",
      "getProtectedNow": "Get Protected Now",
      "trustIndicators": {
        "rating": "4.9/5 Rating",
        "protected": "10,000+ People Protected",
        "available": "24/7 Available"
      },
      "features": {
        "instantAlerts": {
          "title": "Instant Alerts",
          "description": "One tap sends emergency alerts to your trusted contacts"
        },
        "liveLocation": {
          "title": "Live Location",
          "description": "Shares your real-time location during emergencies"
        },
        "trustedNetwork": {
          "title": "Trusted Network",
          "description": "Build your personal safety network of contacts"
        },
        "alwaysReady": {
          "title": "Always Ready",
          "description": "Quick access when you need it most"
        }
      },
      "readyToFeelSafer": "Ready to Feel Safer?",
      "joinThousands": "Join thousands of people who trust SafeStep to keep them protected.",
      "startFreeToday": "Start Free Today",
      "empoweringSafety": "Empowering safety for everyone, anywhere and everywhere.",

      // Login Page
      "welcomeBack": "Welcome Back",
      "signInToContinue": "Sign in to your account to continue",
      "emailAddress": "Email Address",
      "enterEmail": "Enter your email",
      "password": "Password",
      "enterPassword": "Enter your password",
      "forgotPassword": "Forgot your password?",
      "signingIn": "Signing in...",
      "newToPlatform": "New to our platform?",
      "createNewAccount": "Create New Account",
      "termsAgreement": "By signing in, you agree to our",
      "termsOfService": "Terms of Service",
      "and": "and",
      "privacyPolicy": "Privacy Policy",

      // Register Page
      "createAccount": "Create Account",
      "verifyEmail": "Verify Email",
      "startJourney": "Start your journey with us today",
      "verificationSent": "We sent a verification code to",
      "fullName": "Full Name",
      "enterFullName": "Enter your full name",
      "createStrongPassword": "Create a strong password",
      "confirmPassword": "Confirm Password",
      "confirmYourPassword": "Confirm your password",
      "verificationCode": "Verification Code",
      "enterVerificationCode": "Enter the 6-digit code",
      "sendingOtp": "Sending OTP...",
      "sendVerificationCode": "Send Verification Code",
      "verifyingOtp": "Verifying OTP...",
      "completeRegistration": "Complete Registration",
      "backToEmail": "Back to Email",
      "email": "Email",
      "verify": "Verify",

      // Dashboard
      "dashboard": "SafeStep Dashboard",
      "personalSafetyCommand": "Your personal safety command center",
      "active": "Active",
      "changePassword": "Change Password",
      "logout": "Logout",
      "emergencyContacts": "Emergency Contacts",
      "locationStatus": "Location Status",
      "activeStatus": "Active",
      "inactiveStatus": "Inactive",
      "totalAlerts": "Total Alerts",
      "addContact": "Add Contact",
      "removeContact": "Remove Contact",
      "sendEmergencyAlert": "Send Emergency Alert",
      "emergencyAlertSent": "Emergency alert sent to your contacts!",
      "addContactsFirst": "Please add emergency contacts first",
      "locationNotAvailable": "Location not available",
      "contactAdded": "Contact added successfully",
      "contactRemoved": "Contact removed",
      "failedToAddContact": "Failed to add contact",
      "failedToRemoveContact": "Failed to remove contact",
      "failedToSendAlert": "Failed to send emergency alert",
      "failedToLoadContacts": "Failed to load contacts",
      "locationAccessError": "Unable to access your location. Some features may be limited.",

      // Emergency Services Directory
      "emergencyServicesDirectory": "Emergency Services Directory",
      "quickAccessDescription": "Quick access to emergency service providers and important contact numbers",
      "police": "Police",
      "emergencyResponse": "Emergency Response",
      "fireDepartment": "Fire Department",
      "fireRescue": "Fire & Rescue",
      "ambulance": "Ambulance",
      "medicalEmergency": "Medical Emergency",
      "poisonControl": "Poison Control",
      "toxicExposure": "Toxic Exposure",
      "domesticViolence": "Domestic Violence",
      "support247": "24/7 Support",
      "suicidePrevention": "Suicide Prevention",
      "crisisSupport": "Crisis Support",
      "quickActions": "Quick Actions",
      "call999": "Call 999",
      "poisonControlCall": "Poison Control",
      "crisisLine": "Crisis Line (999)",
      "noContactsYet": "No emergency contacts added yet",
      "addContactsToReceive": "Add contacts to receive emergency alerts",
      "safetyPriority": "SafeStep - Your safety is our priority. Available 24/7.",

      // Add Contact Modal
      "addNewContact": "Add New Contact",
      "contactName": "Contact Name",
      "enterContactName": "Enter contact name",
      "contactEmail": "Contact Email",
      "enterContactEmail": "Enter contact email",
      "addContactDescription": "Add a trusted contact who will receive emergency alerts",
      "contactNameRequired": "Contact name is required",
      "contactEmailRequired": "Contact email is required",
      "invalidEmail": "Please enter a valid email address",
      "addingContact": "Adding contact...",

      // Common
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "cancel": "Cancel",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "close": "Close",
      "submit": "Submit",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "yes": "Yes",
      "no": "No",
      "ok": "OK",
      "required": "Required",
      "optional": "Optional"
    }
  },
  ar: {
    translation: {
      // Landing Page
      "welcome": "مرحبًا بك في سيف ستيب!",
      "getStarted": "ابدأ الآن",
      "goToDashboard": "اذهب إلى لوحة التحكم",
      "signIn": "تسجيل الدخول",
      "emergency": "الطوارئ: ٩١١",
      "staySafe": "ابق آمنًا،",
      "stayConnected": "ابق متصلًا",
      "heroSubtitle": "ضغطة واحدة ترسل موقعك إلى جهات الاتصال الموثوقة عندما تحتاج للمساعدة.",
      "getProtectedNow": "احصل على الحماية الآن",
      "trustIndicators": {
        "rating": "تقييم ٤.٩/٥",
        "protected": "أكثر من ١٠,٠٠٠ شخص محمي",
        "available": "متاح ٢٤/٧"
      },
      "features": {
        "instantAlerts": {
          "title": "تنبيهات فورية",
          "description": "ضغطة واحدة ترسل تنبيهات الطوارئ إلى جهات الاتصال الموثوقة"
        },
        "liveLocation": {
          "title": "الموقع المباشر",
          "description": "يشارك موقعك في الوقت الفعلي أثناء الطوارئ"
        },
        "trustedNetwork": {
          "title": "الشبكة الموثوقة",
          "description": "ابن شبكة الأمان الشخصية من جهات الاتصال"
        },
        "alwaysReady": {
          "title": "دائمًا جاهز",
          "description": "وصول سريع عندما تحتاجه أكثر"
        }
      },
      "readyToFeelSafer": "هل أنت مستعد للشعور بالأمان؟",
      "joinThousands": "انضم إلى آلاف الأشخاص الذين يثقون بسيف ستيب لحمايتهم.",
      "startFreeToday": "ابدأ مجانًا اليوم",
      "empoweringSafety": "تمكين الأمان للجميع، في أي مكان وفي كل مكان.",

      // Login Page
      "welcomeBack": "مرحبًا بعودتك",
      "signInToContinue": "سجل دخولك للمتابعة",
      "emailAddress": "عنوان البريد الإلكتروني",
      "enterEmail": "أدخل بريدك الإلكتروني",
      "password": "كلمة المرور",
      "enterPassword": "أدخل كلمة المرور",
      "forgotPassword": "نسيت كلمة المرور؟",
      "signingIn": "جاري تسجيل الدخول...",
      "newToPlatform": "جديد على منصتنا؟",
      "createNewAccount": "إنشاء حساب جديد",
      "termsAgreement": "بتسجيل الدخول، أنت توافق على",
      "termsOfService": "شروط الخدمة",
      "and": "و",
      "privacyPolicy": "سياسة الخصوصية",

      // Register Page
      "createAccount": "إنشاء حساب",
      "verifyEmail": "تأكيد البريد الإلكتروني",
      "startJourney": "ابدأ رحلتك معنا اليوم",
      "verificationSent": "أرسلنا رمز التحقق إلى",
      "fullName": "الاسم الكامل",
      "enterFullName": "أدخل اسمك الكامل",
      "createStrongPassword": "أنشئ كلمة مرور قوية",
      "confirmPassword": "تأكيد كلمة المرور",
      "confirmYourPassword": "أكد كلمة المرور",
      "verificationCode": "رمز التحقق",
      "enterVerificationCode": "أدخل الرمز المكون من ٦ أرقام",
      "sendingOtp": "جاري إرسال رمز التحقق...",
      "sendVerificationCode": "إرسال رمز التحقق",
      "verifyingOtp": "جاري التحقق...",
      "completeRegistration": "إكمال التسجيل",
      "backToEmail": "العودة إلى البريد الإلكتروني",
      "email": "البريد الإلكتروني",
      "verify": "تحقق",

      // Dashboard
      "dashboard": "لوحة تحكم سيف ستيب",
      "personalSafetyCommand": "مركز الأمان الشخصي الخاص بك",
      "active": "نشط",
      "changePassword": "تغيير كلمة المرور",
      "logout": "تسجيل الخروج",
      "emergencyContacts": "جهات الاتصال الطارئة",
      "locationStatus": "حالة الموقع",
      "activeStatus": "نشط",
      "inactiveStatus": "غير نشط",
      "totalAlerts": "إجمالي التنبيهات",
      "addContact": "إضافة جهة اتصال",
      "removeContact": "إزالة جهة الاتصال",
      "sendEmergencyAlert": "إرسال تنبيه طارئ",
      "emergencyAlertSent": "تم إرسال تنبيه الطوارئ إلى جهات الاتصال!",
      "addContactsFirst": "يرجى إضافة جهات الاتصال الطارئة أولاً",
      "locationNotAvailable": "الموقع غير متاح",
      "contactAdded": "تمت إضافة جهة الاتصال بنجاح",
      "contactRemoved": "تمت إزالة جهة الاتصال",
      "failedToAddContact": "فشل في إضافة جهة الاتصال",
      "failedToRemoveContact": "فشل في إزالة جهة الاتصال",
      "failedToSendAlert": "فشل في إرسال تنبيه الطوارئ",
      "failedToLoadContacts": "فشل في تحميل جهات الاتصال",
      "locationAccessError": "غير قادر على الوصول إلى موقعك. قد تكون بعض الميزات محدودة.",

      // Emergency Services Directory
      "emergencyServicesDirectory": "دليل خدمات الطوارئ",
      "quickAccessDescription": "وصول سريع لمقدمي خدمات الطوارئ وأرقام الاتصال المهمة",
      "police": "الشرطة",
      "emergencyResponse": "الاستجابة للطوارئ",
      "fireDepartment": "إدارة الإطفاء",
      "fireRescue": "الإطفاء والإنقاذ",
      "ambulance": "الإسعاف",
      "medicalEmergency": "الطوارئ الطبية",
      "poisonControl": "مكافحة السموم",
      "toxicExposure": "التعرض للسموم",
      "domesticViolence": "العنف المنزلي",
      "support247": "الدعم ٢٤/٧",
      "suicidePrevention": "منع الانتحار",
      "crisisSupport": "دعم الأزمات",
      "quickActions": "الإجراءات السريعة",
      "call999": "اتصل بـ ٩٩٩",
      "poisonControlCall": "مكافحة السموم",
      "crisisLine": "خط الأزمات (٩٩٩)",
      "noContactsYet": "لم يتم إضافة جهات اتصال طارئة بعد",
      "addContactsToReceive": "أضف جهات الاتصال لتلقي تنبيهات الطوارئ",
      "safetyPriority": "سيف ستيب - سلامتك أولويتنا. متاح ٢٤/٧.",

      // Add Contact Modal
      "addNewContact": "إضافة جهة اتصال جديدة",
      "contactName": "اسم جهة الاتصال",
      "enterContactName": "أدخل اسم جهة الاتصال",
      "contactEmail": "بريد جهة الاتصال الإلكتروني",
      "enterContactEmail": "أدخل بريد جهة الاتصال الإلكتروني",
      "addContactDescription": "أضف جهة اتصال موثوقة ستتلقى تنبيهات الطوارئ",
      "contactNameRequired": "اسم جهة الاتصال مطلوب",
      "contactEmailRequired": "بريد جهة الاتصال الإلكتروني مطلوب",
      "invalidEmail": "يرجى إدخال عنوان بريد إلكتروني صحيح",
      "addingContact": "جاري إضافة جهة الاتصال...",

      // Common
      "loading": "جاري التحميل...",
      "error": "خطأ",
      "success": "نجح",
      "cancel": "إلغاء",
      "save": "حفظ",
      "delete": "حذف",
      "edit": "تعديل",
      "close": "إغلاق",
      "submit": "إرسال",
      "back": "رجوع",
      "next": "التالي",
      "previous": "السابق",
      "yes": "نعم",
      "no": "لا",
      "ok": "موافق",
      "required": "مطلوب",
      "optional": "اختياري"
    }
  },
  hi: {
    translation: {
      // Landing Page
      "welcome": "SafeStep में आपका स्वागत है!",
      "getStarted": "शुरू करें",
      "goToDashboard": "डैशबोर्ड पर जाएं",
      "signIn": "साइन इन करें",
      "emergency": "आपातकाल: ९११",
      "staySafe": "सुरक्षित रहें,",
      "stayConnected": "जुड़े रहें",
      "heroSubtitle": "एक टैप आपकी लोकेशन को विश्वसनीय संपर्कों को भेजता है जब आपको सबसे ज्यादा मदद की जरूरत हो।",
      "getProtectedNow": "अभी सुरक्षित हों",
      "trustIndicators": {
        "rating": "४.९/५ रेटिंग",
        "protected": "१०,०००+ लोग सुरक्षित",
        "available": "२४/७ उपलब्ध"
      },
      "features": {
        "instantAlerts": {
          "title": "तत्काल अलर्ट",
          "description": "एक टैप आपातकालीन अलर्ट को विश्वसनीय संपर्कों को भेजता है"
        },
        "liveLocation": {
          "title": "लाइव लोकेशन",
          "description": "आपातकाल के दौरान आपकी रीयल-टाइम लोकेशन साझा करता है"
        },
        "trustedNetwork": {
          "title": "विश्वसनीय नेटवर्क",
          "description": "संपर्कों का अपना व्यक्तिगत सुरक्षा नेटवर्क बनाएं"
        },
        "alwaysReady": {
          "title": "हमेशा तैयार",
          "description": "जब आपको सबसे ज्यादा जरूरत हो तो तुरंत पहुंच"
        }
      },
      "readyToFeelSafer": "सुरक्षित महसूस करने के लिए तैयार हैं?",
      "joinThousands": "हजारों लोगों में शामिल हों जो SafeStep पर भरोसा करते हैं।",
      "startFreeToday": "आज मुफ्त शुरू करें",
      "empoweringSafety": "सभी के लिए सुरक्षा को सशक्त बनाना, कहीं भी और हर जगह।",

      // Login Page
      "welcomeBack": "वापसी पर स्वागत है",
      "signInToContinue": "जारी रखने के लिए अपने खाते में साइन इन करें",
      "emailAddress": "ईमेल पता",
      "enterEmail": "अपना ईमेल दर्ज करें",
      "password": "पासवर्ड",
      "enterPassword": "अपना पासवर्ड दर्ज करें",
      "forgotPassword": "पासवर्ड भूल गए?",
      "signingIn": "साइन इन हो रहा है...",
      "newToPlatform": "हमारे प्लेटफॉर्म पर नए हैं?",
      "createNewAccount": "नया खाता बनाएं",
      "termsAgreement": "साइन इन करके, आप हमारी",
      "termsOfService": "सेवा की शर्तों",
      "and": "और",
      "privacyPolicy": "गोपनीयता नीति",

      // Register Page
      "createAccount": "खाता बनाएं",
      "verifyEmail": "ईमेल सत्यापित करें",
      "startJourney": "आज हमारे साथ अपनी यात्रा शुरू करें",
      "verificationSent": "हमने सत्यापन कोड भेजा है",
      "fullName": "पूरा नाम",
      "enterFullName": "अपना पूरा नाम दर्ज करें",
      "createStrongPassword": "एक मजबूत पासवर्ड बनाएं",
      "confirmPassword": "पासवर्ड की पुष्टि करें",
      "confirmYourPassword": "अपने पासवर्ड की पुष्टि करें",
      "verificationCode": "सत्यापन कोड",
      "enterVerificationCode": "६-अंकीय कोड दर्ज करें",
      "sendingOtp": "OTP भेज रहा है...",
      "sendVerificationCode": "सत्यापन कोड भेजें",
      "verifyingOtp": "OTP सत्यापित कर रहा है...",
      "completeRegistration": "पंजीकरण पूरा करें",
      "backToEmail": "ईमेल पर वापस जाएं",
      "email": "ईमेल",
      "verify": "सत्यापित करें",

      // Dashboard
      "dashboard": "SafeStep डैशबोर्ड",
      "personalSafetyCommand": "आपका व्यक्तिगत सुरक्षा कमांड सेंटर",
      "active": "सक्रिय",
      "changePassword": "पासवर्ड बदलें",
      "logout": "लॉगआउट",
      "emergencyContacts": "आपातकालीन संपर्क",
      "locationStatus": "स्थान स्थिति",
      "activeStatus": "सक्रिय",
      "inactiveStatus": "निष्क्रिय",
      "totalAlerts": "कुल अलर्ट",
      "addContact": "संपर्क जोड़ें",
      "removeContact": "संपर्क हटाएं",
      "sendEmergencyAlert": "आपातकालीन अलर्ट भेजें",
      "emergencyAlertSent": "आपातकालीन अलर्ट आपके संपर्कों को भेज दिया गया!",
      "addContactsFirst": "कृपया पहले आपातकालीन संपर्क जोड़ें",
      "locationNotAvailable": "स्थान उपलब्ध नहीं है",
      "contactAdded": "संपर्क सफलतापूर्वक जोड़ा गया",
      "contactRemoved": "संपर्क हटा दिया गया",
      "failedToAddContact": "संपर्क जोड़ने में विफल",
      "failedToRemoveContact": "संपर्क हटाने में विफल",
      "failedToSendAlert": "आपातकालीन अलर्ट भेजने में विफल",
      "failedToLoadContacts": "संपर्क लोड करने में विफल",
      "locationAccessError": "आपकी लोकेशन तक पहुंचने में असमर्थ। कुछ सुविधाएं सीमित हो सकती हैं।",

      // Emergency Services Directory
      "emergencyServicesDirectory": "आपातकालीन सेवाओं की निर्देशिका",
      "quickAccessDescription": "आपातकालीन सेवा प्रदाताओं और महत्वपूर्ण संपर्क नंबरों तक त्वरित पहुंच",
      "police": "पुलिस",
      "emergencyResponse": "आपातकालीन प्रतिक्रिया",
      "fireDepartment": "अग्निशमन विभाग",
      "fireRescue": "अग्निशमन और बचाव",
      "ambulance": "एम्बुलेंस",
      "medicalEmergency": "चिकित्सीय आपातकाल",
      "poisonControl": "विष नियंत्रण",
      "toxicExposure": "विषाक्त जोखिम",
      "domesticViolence": "घरेलू हिंसा",
      "support247": "24/7 सहायता",
      "suicidePrevention": "आत्महत्या रोकथाम",
      "crisisSupport": "संकट सहायता",
      "quickActions": "त्वरित कार्रवाई",
      "call999": "999 पर कॉल करें",
      "poisonControlCall": "विष नियंत्रण",
      "crisisLine": "संकट लाइन (999)",
      "noContactsYet": "अभी तक कोई आपातकालीन संपर्क नहीं जोड़ा गया",
      "addContactsToReceive": "आपातकालीन अलर्ट प्राप्त करने के लिए संपर्क जोड़ें",
      "safetyPriority": "SafeStep - आपकी सुरक्षा हमारी प्राथमिकता है। 24/7 उपलब्ध।",

      // Add Contact Modal
      "addNewContact": "नया संपर्क जोड़ें",
      "contactName": "संपर्क का नाम",
      "enterContactName": "संपर्क का नाम दर्ज करें",
      "contactEmail": "संपर्क का ईमेल",
      "enterContactEmail": "संपर्क का ईमेल दर्ज करें",
      "addContactDescription": "एक विश्वसनीय संपर्क जोड़ें जो आपातकालीन अलर्ट प्राप्त करेगा",
      "contactNameRequired": "संपर्क का नाम आवश्यक है",
      "contactEmailRequired": "संपर्क का ईमेल आवश्यक है",
      "invalidEmail": "कृपया एक वैध ईमेल पता दर्ज करें",
      "addingContact": "संपर्क जोड़ रहा है...",

      // Common
      "loading": "लोड हो रहा है...",
      "error": "त्रुटि",
      "success": "सफलता",
      "cancel": "रद्द करें",
      "save": "सहेजें",
      "delete": "हटाएं",
      "edit": "संपादित करें",
      "close": "बंद करें",
      "submit": "सबमिट करें",
      "back": "वापस",
      "next": "अगला",
      "previous": "पिछला",
      "yes": "हाँ",
      "no": "नहीं",
      "ok": "ठीक है",
      "required": "आवश्यक",
      "optional": "वैकल्पिक"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 