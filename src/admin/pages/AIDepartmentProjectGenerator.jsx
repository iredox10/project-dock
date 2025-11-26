import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCpu, FiHome, FiBook, FiPlus, FiLoader, FiZap, FiAward, FiRefreshCw } from 'react-icons/fi';
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 text-sm">
          <FiArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiCpu className="text-gray-900" />
              AI Generator
            </h1>
            <p className="text-sm text-gray-500 mt-1">Generate departments and projects using AI.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiZap className="text-gray-600 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Nigerian Academic Context</h3>
            <p className="text-sm text-gray-500">
              This tool generates realistic departments and projects commonly found in Nigerian universities,
              polytechnics, and colleges of education. All content is contextually relevant.
            </p>
          </div>
        </div>

        {!showResults ? (
          <div className="text-center py-8">
            <button
              onClick={generateDepartmentsAndProjects}
              disabled={isGenerating}
              className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-black transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Generating... {generationProgress.current}/{generationProgress.total}</span>
                </>
              ) : (
                <>
                  <FiCpu />
                  <span>Generate Content</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div>
            {generatedDepartments.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-100 rounded-md p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <FiHome className="text-green-600" />
                    <span className="font-medium text-sm">
                      Found {generatedDepartments.length} new departments with {generatedProjects.length} projects
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {generatedDepartments.map((dept, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{dept.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                          {dept.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{dept.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiBook className="w-3 h-3" />
                        {dept.projects.length} projects
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-100">
                  <button
                    onClick={saveToDatabase}
                    disabled={isGenerating}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-md font-medium flex items-center gap-2 justify-center hover:bg-black transition-all disabled:opacity-50 text-sm shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <FiLoader className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiPlus />
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
                    className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-all text-sm flex items-center gap-2 justify-center"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Generate New
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHome className="text-xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Departments Exist</h3>
                <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
                  The generated departments already exist in your system. No new content to add.
                </p>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setGeneratedDepartments([]);
                    setGeneratedProjects([]);
                  }}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-md font-medium hover:bg-black transition-all text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDepartmentProjectGenerator;