import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRobot, FaUniversity, FaBook, FaPlus, FaSpinner, FaMagic, FaGraduationCap } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, query, getDocs, where } from 'firebase/firestore';

const AIDepartmentProjectGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [generatedDepartments, setGeneratedDepartments] = useState([]);
  const [generatedProjects, setGeneratedProjects] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Check if department already exists in the system
  const checkDepartmentExists = async (departmentName) => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('department', '==', departmentName));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err) {
      console.error('Error checking department:', err);
      return false;
    }
  };

  // Generate departments and projects using Gemini AI
  const generateDepartmentsAndProjects = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedDepartments([]);
    setGeneratedProjects([]);
    setShowResults(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
      }

      // List of models to try in order (same as in aiExtractionService.js)
      const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro-latest',
      ];

      // Generate Nigerian university departments
      const departmentsPrompt = `
        Generate a comprehensive list of academic departments found in Nigerian universities and polytechnics.
        Focus on departments relevant to the following areas:
        - Engineering (Civil, Mechanical, Electrical, Computer, Chemical, etc.)
        - Sciences (Computer Science, Mathematics, Physics, Chemistry, Biology, Biochemistry, etc.)
        - Social Sciences (Economics, Sociology, Psychology, Political Science, etc.)
        - Management Sciences (Business Administration, Accounting, Marketing, etc.)
        - Arts and Humanities (English, History, Philosophy, etc.)
        - Medicine and Allied Health Sciences
        - Agriculture and Environmental Sciences

        Return the response in this exact JSON format:
        {
          "departments": [
            {
              "name": "Department name",
              "description": "Brief description of the department",
              "level": "BSc/MSc/HND/ND/PhD",
              "projects": [
                {
                  "title": "Project title",
                  "description": "Brief project description",
                  "abstract": "Detailed abstract of the project",
                  "year": 2023,
                  "pages": 120,
                  "author": "Author name"
                }
              ]
            }
          ]
        }

        Important: Include 15-20 departments with 3-5 projects each. Make sure the projects are realistic and relevant to Nigerian academic context.
      `;

      let lastError;

      // Try each model using direct API calls (same approach as aiExtractionService.js)
      for (const modelName of modelsToTry) {
        try {
          console.log(`Trying model: ${modelName}`);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: departmentsPrompt
                  }]
                }]
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
          }

          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!responseText) {
            throw new Error('No response text from AI');
          }

          // Try to extract JSON from response
          let jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('AI did not return valid JSON');
          }

          const resultData = JSON.parse(jsonMatch[0]);

          console.log(`Successfully used model: ${modelName}`);

          // Filter out departments that already exist in the system
          setGenerationProgress({ current: 0, total: resultData.departments.length });

          const filteredDepartments = [];
          for (let i = 0; i < resultData.departments.length; i++) {
            const dept = resultData.departments[i];
            setGenerationProgress(prev => ({ ...prev, current: i + 1 }));

            const exists = await checkDepartmentExists(dept.name);
            if (!exists) {
              filteredDepartments.push(dept);
            }
          }

          setGeneratedDepartments(filteredDepartments);
          setGeneratedProjects(resultData.departments.flatMap(dept =>
            dept.projects.map(project => ({ ...project, department: dept.name, level: dept.level }))
          ));

          return; // Exit if successful
        } catch (error) {
          console.log(`Model ${modelName} failed:`, error.message);
          lastError = error;
          continue;
        }
      }

      // If all models failed
      throw new Error('Failed to generate departments and projects: ' + (lastError?.message || 'All models failed'));
    } catch (error) {
      console.error('Error generating departments and projects:', error);
      setError('Failed to generate departments and projects: ' + error.message);
    } finally {
      setIsGenerating(false);
      setShowResults(true);
    }
  };

  // Save generated departments and projects to database
  const saveToDatabase = async () => {
    if (!generatedDepartments.length) return;

    setIsGenerating(true);
    setError('');

    try {
      let savedCount = 0;

      for (const department of generatedDepartments) {
        // Save each project in the department
        for (const project of department.projects) {
          await addDoc(collection(db, 'projects'), {
            ...project,
            department: department.name,
            level: department.level,
            priceNGN: Math.floor(Math.random() * 5000) + 1000, // Random price between 1000-6000
            downloadCount: Math.floor(Math.random() * 100),
            formats: ['PDF', 'DOCX'],
            includes: ['Abstract', 'References', 'Questionnaire'],
            createdAt: serverTimestamp()
          });
          savedCount++;
        }
      }

      alert(`Successfully saved ${savedCount} projects across ${generatedDepartments.length} departments!`);
      navigate('/admin/projects');

    } catch (error) {
      console.error('Error saving to database:', error);
      setError('Failed to save to database: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/projects"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
          >
            <FaArrowLeft />
            Back to Manage Projects
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col items-start gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FaMagic className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <FaRobot className="text-indigo-600" />
                    AI Department & Project Generator
                  </h1>
                  <p className="text-slate-600 mt-1 text-sm">
                    Generate departments and projects relevant to Nigerian institutions using AI
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <FaGraduationCap className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1 text-sm">Nigerian Academic Focus</h3>
                  <p className="text-blue-800 text-xs">
                    This tool generates realistic departments and projects commonly found in Nigerian universities,
                    polytechnics, and colleges of education. All content is contextually relevant to the Nigerian academic environment.
                  </p>
                </div>
              </div>
            </div>

            {!showResults ? (
              <div className="text-center">
                <button
                  onClick={generateDepartmentsAndProjects}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Generating... {generationProgress.current}/{generationProgress.total}</span>
                    </>
                  ) : (
                    <>
                      <FaRobot />
                      <span>Generate Nigerian Departments & Projects</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {generatedDepartments.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <FaUniversity className="text-green-600" />
                        <span className="font-semibold text-sm">
                          Found {generatedDepartments.length} new departments with {generatedProjects.length} projects
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {generatedDepartments.map((dept, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                              {dept.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{dept.description}</p>
                          <div className="text-xs text-slate-500">
                            {dept.projects.length} projects
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <button
                        onClick={saveToDatabase}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 justify-center hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 text-sm"
                      >
                        {isGenerating ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <FaPlus />
                            <span>Save All to Database</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setShowResults(false);
                          setGeneratedDepartments([]);
                          setGeneratedProjects([]);
                        }}
                        className="bg-slate-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-700 transition-all text-sm"
                      >
                        Generate New
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaUniversity className="text-xl text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">All Departments Already Exist</h3>
                    <p className="text-slate-600 mb-3 text-sm">
                      The generated departments already exist in your system. No new departments to add.
                    </p>
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setGeneratedDepartments([]);
                        setGeneratedProjects([]);
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm"
                    >
                      Generate Different Departments
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDepartmentProjectGenerator;