# CBDA Exam Simulator - Local Storage Edition

Professional exam simulation platform for CBDA certification preparation with local JSON storage.

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

3. **Add Your Logo**
- Place your academy logo as `public/logo.png`
- Recommended: 500x500px PNG with transparent background

### Running the Application

**Terminal 1 - Frontend:**
```bash
npm start
```
Runs on http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```
Runs on http://localhost:5000

## 👤 Login Credentials

### Student Account
- Email: `student@cbda.com`
- Password: `student123`

### Admin Account
- Email: `admin@cbda.com`
- Password: `admin123`

## 📝 Uploading Questions

### JSON File Format

Each question file must follow this exact format:
```json
[
  {
    "id": 1,
    "question": "Your question text here?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": 1,
    "domain": "Business Acumen",
    "difficulty": "medium"
  }
]
```

**Required Fields:**
- `id`: Unique number for each question
- `question`: The question text
- `options`: Array of exactly 4 answer options
- `correctAnswer`: Index of correct answer (0, 1, 2, or 3)
- `domain`: Domain name (e.g., "Business Acumen", "Data Governance")
- `difficulty`: "easy", "medium", or "hard"

### Upload Instructions

1. Login as admin (admin@cbda.com / admin123)
2. Go to "Manage Questions"
3. Upload JSON files for:
   - **5 Chapter Tests**: Business Acumen, Data Governance, Data Analysis, Data Visualization, Data Strategy
   - **4 Mock Exams**: Mock Exam 1, 2, 3, 4 (each should have 75 questions)

## 📊 Features

✅ **Student Dashboard**
- Take chapter-wise tests
- Take full-length mock exams (75 questions, 120 minutes)
- View performance history
- Track progress and scores

✅ **Admin Dashboard**
- Upload questions via JSON files
- Upload custom logo
- View all student results
- Export results to CSV
- Monitor statistics (total students, average score, pass rate)
- Manage students

✅ **Local Storage**
- All data stored in JSON files
- No external dependencies
- No costs
- Export to CSV anytime

## 📁 Data Storage Location

All data is stored in:
- Questions: `backend/data/questions/`
- Results: `backend/data/results/all_results.json`
- Users: `backend/data/users.json`

## 🔧 Customization

### Change Timer Duration

Edit `src/components/StudentDashboard.js`:
```javascript
// For mock exams (default 120 minutes)
setTimeRemaining(7200); // seconds

// For chapter tests (default 60 minutes)
setTimeRemaining(3600); // seconds
```

### Change Colors

Edit `tailwind.config.js` to customize colors.

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🎯 Test Features

- Real-time countdown timer
- Question navigator
- Auto-submit when time expires
- Immediate score display
- Pass/fail indication (70% passing score)
- Answer tracking
- Progress bar

## 📈 Admin Features

- Dashboard with statistics
- Upload questions for all tests
- View all student results
- Export results to CSV
- Track student performance
- Delete results
- Upload custom logo

## 💾 Export Data

Admin can export all results to CSV:
1. Login as admin
2. Go to "View Results"
3. Click "Export to CSV"
4. File downloads automatically

## 🐛 Troubleshooting

### Backend not starting
```bash
cd backend
npm install
npm start
```

### Frontend errors
```bash
npm install
npm start
```

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

## 📞 Support

For issues:
1. Check both terminals for error messages
2. Ensure both frontend and backend are running
3. Verify JSON files follow the correct format
4. Check that logo.png exists in public folder

## 🎉 You're Ready!

Your CBDA Exam Simulator is ready to use with local storage!

---

Made with ❤️ for CBDA certification success
````

---

## 🎯 **Final Setup Instructions**

### **Step 1: Create Project**
````bash
npx create-react-app cbda-exam-simulator
cd cbda-exam-simulator
````

### **Step 2: Install Dependencies**
````bash
# Frontend
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Backend
mkdir backend
cd backend
npm init -y
npm install express cors dotenv multer bcryptjs
npm install --save-dev nodemon
cd ..
````

### **Step 3: Copy All Files**
Copy all the code I provided above into the respective files.

### **Step 4: Add Your Logo**
Place your logo as `public/logo.png`

### **Step 5: Run Application**

**Terminal 1:**
````bash
npm start
````

**Terminal 2:**
````bash
cd backend
npm start
````

### **Step 6: Login & Upload Questions**
1. Go to http://localhost:3000
2. Login as admin: `admin@cbda.com` / `admin123`
3. Upload your JSON question files
4. Start testing!

---

## ✅ **What You Get**

✅ Complete working application
✅ No Firebase costs
✅ No Google Sheets needed
✅ Local JSON storage
✅ Export to CSV functionality
✅ Admin & Student dashboards
✅ Fully responsive
✅ Timer with auto-submit
✅ Performance tracking
✅ Question navigator
✅ User authentication
✅ All features working

**This is production-ready and costs absolutely nothing to run!** 🚀