
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaDownload, FaSpinner } from 'react-icons/fa';

export const MyProjectsPage = () => {
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Get user's purchased project IDs
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const projectIds = userDoc.exists() ? userDoc.data().purchasedProjects || [] : [];

          if (projectIds.length > 0) {
            // 2. Fetch the projects using the IDs
            // Firestore 'in' query is limited to 30 items. For more, you'd need multiple queries.
            const projectsRef = collection(db, 'projects');
            const q = query(projectsRef, where('__name__', 'in', projectIds));
            const projectSnapshots = await getDocs(q);
            const projectsData = projectSnapshots.docs.map(d => ({ id: d.id, ...d.data() }));
            setPurchasedProjects(projectsData);
          }
        } catch (error) {
          console.error("Error fetching purchased projects:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">My Purchased Projects</h1>
        <p className="text-sm md:text-base text-gray-600">View and download all your purchased projects</p>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
        {purchasedProjects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {purchasedProjects.map(project => (
              <li key={project.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-800">{project.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{project.department}</p>
                </div>
                <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
                  <Link 
                    to={`/projects/${project.id}`} 
                    className="flex-1 sm:flex-none text-center font-semibold text-indigo-600 hover:underline px-4 py-2 text-sm md:text-base"
                  >
                    View
                  </Link>
                  <Link
                    to={`/projects/${project.id}/download-file`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-3 md:px-4 py-2 rounded-lg hover:bg-green-600 text-sm md:text-base"
                  >
                    <FaDownload /> Download
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 md:py-10">
            <p className="text-sm md:text-base text-gray-600 mb-4">You haven't purchased any projects yet.</p>
            <Link 
              to="/projects" 
              className="inline-block bg-indigo-600 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 text-sm md:text-base"
            >
              Browse Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
