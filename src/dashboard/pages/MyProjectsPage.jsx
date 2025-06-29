
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
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">My Purchased Projects</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {purchasedProjects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {purchasedProjects.map(project => (
              <li key={project.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.department}</p>
                </div>
                <div className="flex gap-4 mt-3 sm:mt-0">
                  <Link to={`/projects/${project.id}`} className="font-semibold text-indigo-600 hover:underline">View</Link>
                  <button className="flex items-center gap-2 bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600 text-sm">
                    <FaDownload /> Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">You haven't purchased any projects yet.</p>
            <Link to="/projects" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700">
              Browse Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
