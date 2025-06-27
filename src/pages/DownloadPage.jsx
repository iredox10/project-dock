
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaWhatsapp, FaUniversity, FaArrowLeft, FaShieldAlt, FaCopy, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';


const DownloadPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectDocRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(projectDocRef);
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError('Failed to load project details.');
        console.error("Error fetching project for download page:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const copyToClipboard = () => {
    const accountNumber = '1234567890';
    const textArea = document.createElement("textarea");
    textArea.value = accountNumber;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Reset after 2 seconds
    } catch (err) {
      setCopySuccess('Failed');
    }
    document.body.removeChild(textArea);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><FaSpinner className="animate-spin text-5xl text-indigo-600" /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <Link to="/projects" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Projects</Link>
      </div>
    );
  }

  const whatsappMessage = `Hello, I'm interested in the project titled "${project.title}". Please guide me on how to proceed with the payment of ₦${project.priceNGN}.`;
  const whatsappLink = `https://wa.me/2348012345678?text=${encodeURIComponent(whatsappMessage)}`; // Replace with your WhatsApp number

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to={`/projects/${projectId}`} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
            <FaArrowLeft />
            Back to Project Details
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8 p-6 text-center">
          <p className="text-lg text-gray-500">You are ordering:</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 my-2">
            {project.title}
          </h1>
          <div className="inline-block bg-indigo-600 text-white font-bold text-3xl md:text-4xl py-3 px-6 rounded-lg shadow-md mt-2">
            PRICE: ₦{project.priceNGN?.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <FaUniversity className="text-4xl text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Direct Bank Transfer</h2>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">Make a direct payment to our corporate account. Your download link will be sent instantly upon confirmation.</p>
            <div className="bg-indigo-50 p-4 rounded-lg space-y-3 border border-indigo-200">
              <p className="font-semibold text-indigo-900">Account Name: <span className="font-mono float-right">Project Dock LTD</span></p>
              <p className="font-semibold text-indigo-900">Bank: <span className="font-mono float-right">UBA</span></p>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-indigo-900">Account No:</p>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border">
                  <span className="font-mono text-indigo-900 text-lg">1234567890</span>
                  <button onClick={copyToClipboard} className="text-gray-500 hover:text-indigo-600">
                    <FaCopy />
                  </button>
                </div>
              </div>
              {copySuccess && <p className="text-sm text-green-600 text-right font-semibold">{copySuccess}</p>}
            </div>
            <p className="text-xs text-center text-gray-500 mt-4">Send payment proof via WhatsApp for faster confirmation.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <FaWhatsapp className="text-4xl text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Order via WhatsApp</h2>
            </div>
            <p className="text-gray-600 mb-6 flex-grow">Prefer to talk to a person? Click below to chat with our support team on WhatsApp. We'll guide you through the payment process.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full mt-auto flex items-center justify-center gap-3 bg-green-500 text-white font-bold px-6 py-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition duration-300 text-lg">
              <FaWhatsapp className="text-2xl" />
              <span>Chat to Order</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
          <FaShieldAlt className="text-green-600" />
          <span>Secure Payment & Instant Delivery Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
