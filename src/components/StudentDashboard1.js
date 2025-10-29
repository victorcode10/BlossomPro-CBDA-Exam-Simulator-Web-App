import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = ({ user = {}, onLogout = () => {} }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [testStarted, setTestStarted] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const chapters = [
    { id: 1, name: 'Business Acumen', questions: 0, domain: 'Domain 1' },
    { id: 2, name: 'Data Governance', questions: 0, domain: 'Domain 2' },
    { id: 3, name: 'Data Analysis', questions: 0, domain: 'Domain 3' },
    { id: 4, name: 'Data Visualization', questions: 0, domain: 'Domain 4' },
    { id: 5, name: 'Data Strategy', questions: 0, domain: 'Domain 5' }
  ];

  const mockExams = [
    { id: 1, name: 'Mock Exam 1', questions: 75, duration: 120 },
    { id: 2, name: 'Mock Exam 2', questions: 75, duration: 120 },
    { id: 3, name: 'Mock Exam 3', questions: 75, duration: 120 },
    { id: 4, name: 'Mock Exam 4', questions: 75, duration: 120 }
  ];

  useEffect(() => {
    if (user && user.id) loadUserResults();
  }, [user]);

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining]);

  const loadUserResults = async () => {
    try {
      const response = await fetch(`/api/results/user/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setTestResults(data.results);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async (test, type) => {
    setLoading(true);
    setQuestions([]);  // Reset questions to prevent old data
    setAnswers({});     // Reset answers
    setCurrentQuestion(0); // Reset current question index
    setTimeRemaining(type === 'mock' ? 7200 : 3600); // Reset time
    setTestStarted(true);  // Start the test

    try {
      const response = await fetch(`/api/questions/${type}/${test.id}`);
      const data = await response.json();

      if (data.success && data.questions.length > 0) {
        setCurrentTest({ ...test, type });
        setQuestions(data.questions);
        setShowResults(false);
        setCurrentPage('test');
      } else {
        alert('No questions available for this test. Please contact the administrator.');
      }
    } catch (error) {
      alert('Error loading test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitTest = async () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);

    const result = {
      testName: currentTest.name,
      testType: currentTest.type,
      score: finalScore,
      date: new Date().toLocaleDateString(),
      timeTaken: formatTime((currentTest.type === 'mock' ? 7200 : 3600) - timeRemaining),
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    };

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      await loadUserResults();
    } catch (error) {
      console.error('Error saving result:', error);
    }

    setTestStarted(false);
    setShowResults(true);
  };

  /* --- Subcomponents --- */
  const Header = () => (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto rounded-lg shadow-md" />
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold">CBDA Exam Simulator</h1>
              <p className="text-blue-100 text-sm">Professional Certification Preparation</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="hover:text-blue-200 transition flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => setCurrentPage('performance')} className="hover:text-blue-200 transition flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Performance</span>
            </button>
            <button onClick={() => setCurrentPage('profile')} className="hover:text-blue-200 transition flex items-center space-x-2">
              <User size={20} />
              <span>Profile</span>
            </button>
            <button onClick={onLogout} className="hover:text-blue-200 transition flex items-center space-x-2">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <button onClick={() => { setCurrentPage('home'); setMenuOpen(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-4 rounded">Dashboard</button>
            <button onClick={() => { setCurrentPage('performance'); setMenuOpen(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-4 rounded">Performance</button>
            <button onClick={() => { setCurrentPage('profile'); setMenuOpen(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-4 rounded">Profile</button>
            <button onClick={() => { onLogout(); setMenuOpen(false); }} className="block w-full text-left py-2 hover:bg-blue-700 px-4 rounded">Logout</button>
          </div>
        )}
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name || 'Student'}!</h2>
              <p className="text-gray-600">Continue your CBDA certification journey</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="text-blue-600" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{testResults.length}</div>
                <div className="text-gray-600">Tests Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="text-green-600" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0}%
                </div>
                <div className="text-gray-600">Avg Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {testResults.length > 0 ? testResults[testResults.length - 1].score : 0}%
                </div>
                <div className="text-gray-600">Last Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Chapter-wise Tests</h3>
            <div className="space-y-3">
              {chapters.map(chapter => (
                <div key={chapter.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{chapter.name}</h4>
                      <p className="text-sm text-gray-600">{chapter.domain}</p>
                    </div>
                    <button
                      onClick={() => startTest(chapter, 'chapter')}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Play size={16} />
                      <span>Start Test</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Full-Length Mock Exams</h3>
            <div className="space-y-3">
              {mockExams.map(exam => (
                <div key={exam.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md hover:shadow-lg transition p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{exam.name}</h4>
                      <p className="text-sm text-gray-600">{exam.questions} questions • {exam.duration} minutes</p>
                    </div>
                    <button
                      onClick={() => startTest(exam, 'mock')}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Play size={16} />
                      <span>Start Exam</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TestPage = () => {
    const currentQ = questions[currentQuestion];
    const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
    const isLowTime = timeRemaining < 600;
    const isCriticalTime = timeRemaining < 300;

    const timerClass = `px-4 md:px-6 py-3 rounded-xl shadow-lg ${isCriticalTime ? 'bg-gradient-to-r from-red-500 to-red-600 timer-pulse' : isLowTime ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {showResults ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className={`inline-block p-4 rounded-full mb-4 ${score >= 70 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {score >= 70 ? <CheckCircle className="text-green-600" size={64} /> : <Target className="text-orange-600" size={64} />}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Completed!</h2>
                <p className="text-gray-600 mb-6">{currentTest?.name}</p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
                  <div className="text-gray-600">Your Score</div>
                  <div className={`mt-2 text-lg font-semibold ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    {score >= 70 ? '✓ Pass' : '✗ Did not pass (70% required)'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{Object.keys(answers).length}/{questions.length}</div>
                    <div className="text-sm text-gray-600">Questions Answered</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{formatTime((currentTest?.type === 'mock' ? 7200 : 3600) - timeRemaining)}</div>
                    <div className="text-sm text-gray-600">Time Taken</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => setCurrentPage('home')} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium">Back to Dashboard</button>
                  <button onClick={() => setCurrentPage('performance')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition font-medium">View Performance</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{currentTest?.name}</h2>
                  <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
                <div className={timerClass}>
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span className="text-xl md:text-2xl font-bold">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">{Math.round(progress)}% Complete</p>
              </div>

              {currentQ ? (
                <div>
                  <div className="bg-blue-50 rounded-xl p-4 md:p-6 mb-6">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">{currentQ.question}</h3>
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(currentQ.id, index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${answers[currentQ.id] === index ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQ.id] === index ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                              {answers[currentQ.id] === index && <div className="w-3 h-3 bg-white rounded-full" />}
                            </div>
                            <span className="text-gray-800 text-sm md:text-base">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 px-4 md:px-6 py-3 rounded-lg transition font-medium flex items-center space-x-2"
                    >
                      <ArrowLeft size={20} />
                      <span className="hidden md:inline">Previous</span>
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                      <button onClick={submitTest} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 md:px-8 py-3 rounded-lg transition font-medium flex items-center space-x-2">
                        <CheckCircle size={20} />
                        <span>Submit Test</span>
                      </button>
                    ) : (
                      <button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))} className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-3 rounded-lg transition font-medium flex items-center space-x-2">
                        <span className="hidden md:inline">Next</span>
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Question Navigator:</p>
                    <div className="flex flex-wrap gap-2">
                      {questions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${idx === currentQuestion ? 'bg-blue-600 text-white' : answers[q.id] !== undefined ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-blue-600 rounded" />
                        <span>Current</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
                        <span>Not Answered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-600">No question available.</div>
              )}
            </div>
          )}
        </div>
      </div>
  )
  };

  const PerformancePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">My Performance</h2>
          {testResults.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No test results yet. Start a test to see your performance!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 hover:shadow-md transition">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{result.testName}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{result.date} • {result.timeTaken} taken</p>
                    </div>
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="text-center">
                        <div className={`text-2xl md:text-3xl font-bold ${result.score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{result.score}%</div>
                        <div className="text-xs md:text-sm text-gray-600">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-800">{result.correctAnswers}/{result.totalQuestions}</div>
                        <div className="text-xs md:text-sm text-gray-600">Correct</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">Student</span>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Total Tests Taken</div>
              <div className="text-2xl font-bold text-gray-800">{testResults.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Average Score</div>
              <div className="text-2xl font-bold text-gray-800">{testResults.length > 0 ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length) : 0}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Highest Score</div>
              <div className="text-2xl font-bold text-gray-800">{testResults.length > 0 ? Math.max(...testResults.map(r => r.score)) : 0}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Tests Passed (70%+)</div>
              <div className="text-2xl font-bold text-gray-800">{testResults.filter(r => r.score >= 70).length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'test' && <TestPage />}
      {currentPage === 'performance' && <PerformancePage />}
      {currentPage === 'profile' && <ProfilePage />}
    </div>
  );
};

export default StudentDashboard;
