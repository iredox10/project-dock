
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDownload, FaFilePdf, FaFileWord, FaHashtag, FaBookOpen, FaCheckCircle, FaDatabase, FaArrowLeft, FaUserGraduate, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config'; // Your Firebase config
import { getDoc, doc } from 'firebase/firestore';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectDocRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(projectDocRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Project not found.');
          console.error("No such document!");
        }
      } catch (err) {
        setError('Failed to fetch project details.');
        console.error("Error fetching document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <Link to="/projects" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Projects</Link>
      </div>
    );
  }

  if (!project) {
    return null; // Should be handled by loading/error states
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
            <FaArrowLeft />
            Back to Project Showcase
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <span className="text-base font-semibold text-indigo-600 tracking-wider uppercase">{project.department}</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mt-4">
                  <div className="flex items-center gap-2"><FaUserGraduate /><span>By {project.author}</span></div>
                  <div className="flex items-center gap-2"><FaCalendarAlt /><span>{project.year}</span></div>
                </div>
              </div>

              <article className="prose prose-lg max-w-none prose-indigo">
                <h2>Abstract</h2>
                <p>{project.abstract}</p>
                <hr />
                <h2>Chapter One Preview</h2>
                {project.chapterOne && project.chapterOne.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </article>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-2xl border">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Project Information</h3>
              <ul className="space-y-3 text-gray-800">
                {project.formats?.includes('PDF') && (
                  <li className="flex items-center gap-3"><FaFilePdf className="text-red-500" /><span>Format: PDF Available</span></li>
                )}
                {project.formats?.includes('DOCX') && (
                  <li className="flex items-center gap-3"><FaFileWord className="text-blue-500" /><span>Format: MS-Word DOC Available</span></li>
                )}
                <li className="flex items-center gap-3"><FaHashtag className="text-gray-500" /><span>Pages: {project.pages || 'N/A'}</span></li>
                <li className="flex items-center gap-3"><FaDatabase className="text-gray-500" /><span>File Size: {project.fileSize || 'N/A'}</span></li>
                <li className="flex items-center gap-3"><FaBookOpen className="text-gray-500" /><span>Chapters: {project.chapters || 'N/A'}</span></li>
                {project.includes?.map(item => (
                  <li key={item} className="flex items-center gap-3"><FaCheckCircle className="text-green-500" /><span>With {item}</span></li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-center text-gray-600 mb-4">Preview Abstract and Chapter One on the left</p>
                <Link to={`/projects/${project.id}/download`} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 text-lg">
                  <FaDownload />
                  <span>Download Project</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
