
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../firebase/config.js ';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaSpinner, FaBook, FaFilePdf, FaCode } from 'react-icons/fa';

const ProjectCard = ({ project }) => (
  <div className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">{project.department}</span>
        {project.fileType === 'PDF' ? <FaFilePdf className="text-red-500 text-2xl" /> : <FaCode className="text-gray-700 text-2xl" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 h-16 group-hover:text-indigo-600 transition-colors duration-300">{project.title}</h3>
      <p className="text-gray-500 mt-2 text-sm">By {project.author} - {project.year}</p>
    </div>
    <div className="p-4 bg-gray-50/70 border-t mt-auto">
      <Link to={`/projects/${project.id}`} className="w-full text-center block bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-150">
        View Details
      </Link>
    </div>
  </div>
);

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const projectsRef = collection(db, 'projects');
        // Note: Firestore does not support native full-text search.
        // This query only matches the exact start of the title.
        // For a real app, a third-party search service like Algolia or Typesense is recommended.
        const q = query(projectsRef,
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Search Results for: <span className="text-indigo-600">"{searchTerm}"</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">{searchResults.length} {searchResults.length === 1 ? 'project' : 'projects'} found.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-5xl text-indigo-600" /></div>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">No Projects Found</h3>
            <p className="text-gray-600 mt-2">Your search for "{searchTerm}" did not match any projects. Try a different keyword.</p>
            <Link to="/projects" className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-150">
              Browse All Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
