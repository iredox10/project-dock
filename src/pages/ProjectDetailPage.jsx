
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDownload, FaFilePdf, FaFileWord, FaHashtag, FaBookOpen, FaCheckCircle, FaDatabase } from 'react-icons/fa';

// Mock data - updated to include more specific details for the sidebar
const mockProjects = [
  {
    id: 1,
    title: 'AI-Powered E-commerce Chatbot',
    department: 'Computer Science',
    year: 2023,
    author: 'Bello Adekunle',
    abstract: 'This project focuses on developing an intelligent chatbot for e-commerce platforms. Leveraging Natural Language Processing (NLP) and machine learning, the chatbot assists users with product queries, order tracking, and customer support, enhancing user experience and operational efficiency.',
    chapterOne: '1.1 Introduction: The rise of conversational AI has transformed customer service across various industries. E-commerce, in particular, stands to benefit significantly from automated, intelligent assistants... \n\n1.2 Statement of the Problem: Many online shoppers abandon their carts due to a lack of immediate support or answers to their questions. This project aims to address this issue by creating a chatbot that provides real-time assistance... \n\n1.3 Objectives of the Study: The primary objective is to design, implement, and evaluate an AI-powered chatbot that can accurately understand and respond to user queries in an e-commerce context...',
    // Details for the new sidebar
    formats: ['PDF', 'DOCX'],
    pages: 85,
    fileSize: '2.5 MB',
    chapters: '1-5',
    includes: ['References', 'Questionnaire'],
  },
  {
    id: 2,
    title: 'Smart Irrigation System using IoT',
    department: 'Electrical Engineering',
    year: 2023,
    author: 'Fatima Yusuf',
    abstract: 'This project presents the design and implementation of a smart irrigation system using Internet of Things (IoT) technology. The system uses soil moisture sensors to automatically water plants when needed, conserving water and improving crop yield. A web dashboard allows for remote monitoring and control.',
    chapterOne: '1.1 Introduction: Agriculture is the backbone of the Nigerian economy, yet it faces significant challenges, including inefficient water usage. This study explores the application of IoT to create a more sustainable and efficient irrigation model... \n\n1.2 Statement of the Problem: Traditional irrigation methods often lead to water wastage and require constant manual supervision. This project seeks to automate the process, reducing both water consumption and labor costs...',
    // Details for the new sidebar
    formats: ['PDF'],
    pages: 62,
    fileSize: '1.8 MB',
    chapters: '1-5',
    includes: ['References'],
  },
];


const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const project = mockProjects.find(p => p.id === parseInt(projectId));

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Link to="/projects" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/projects" className="text-indigo-600 hover:underline">&larr; Back to all projects</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="lg:w-2/3">
            <div className="border-b pb-8 mb-8">
              <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full">{project.department}</span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-4">{project.title}</h1>
              <p className="mt-2 text-gray-600">By {project.author} ({project.year})</p>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
              <div className="bg-gray-50 p-8 rounded-lg border prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{project.abstract}</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chapter One Preview</h2>
              <div className="bg-gray-50 p-8 rounded-lg border prose max-w-none">
                {project.chapterOne.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Project Information</h3>
              <ul className="space-y-3 text-gray-800">
                {project.formats.includes('PDF') && (
                  <li className="flex items-center gap-3"><FaFilePdf className="text-red-500" /><span>Format: PDF Available</span></li>
                )}
                {project.formats.includes('DOCX') && (
                  <li className="flex items-center gap-3"><FaFileWord className="text-blue-500" /><span>Format: MS-Word DOC Available</span></li>
                )}
                <li className="flex items-center gap-3"><FaHashtag className="text-gray-500" /><span>Pages: {project.pages}</span></li>
                <li className="flex items-center gap-3"><FaDatabase className="text-gray-500" /><span>File Size: {project.fileSize}</span></li>
                <li className="flex items-center gap-3"><FaBookOpen className="text-gray-500" /><span>Chapters: {project.chapters}</span></li>
                {project.includes.map(item => (
                  <li key={item} className="flex items-center gap-3"><FaCheckCircle className="text-green-500" /><span>With {item}</span></li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-center text-gray-600 mb-4">Preview Abstract and Chapter One on the left</p>
                <Link to={`/download/${projectId}`} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 text-lg">
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
