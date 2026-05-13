import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Folder, 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Download, 
  Trash2,
  Loader2,
  X,
  UploadCloud,
  FileCheck,
  Filter
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  where, 
  serverTimestamp,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherResources = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [resources, setResources] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newFile, setNewFile] = useState(null);
  const [resourceMeta, setResourceMeta] = useState({ 
    name: '', 
    category: 'General',
    classId: '' 
  });

  const categories = ['General', 'Lesson Plans', 'Past Questions', 'Worksheets', 'Curriculum'];

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Fetch Teacher's assigned classes
    const fetchClasses = async () => {
      const q = query(collection(db, 'assignments'), where('teacherId', '==', currentUser.uid));
      const snap = await getDocs(q);
      setAssignedClasses(snap.docs.map(doc => ({ id: doc.data().classId, name: doc.data().className })));
    };
    fetchClasses();

    const q = query(
      collection(db, 'resources'),
      where('teacherId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in-memory
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setResources(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newFile || !currentUser) return;

    setUploading(true);
    showToast("Starting cloud upload...", "info");
    
    const storageRef = ref(storage, `resources/${currentUser.uid}/${Date.now()}_${newFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newFile);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        console.error("Upload error:", error);
        showToast("Upload failed: " + error.message, "error");
        setUploading(false);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'resources'), {
            name: resourceMeta.name || newFile.name,
            fileName: newFile.name,
            category: resourceMeta.category,
            classId: resourceMeta.classId,
            fileUrl: downloadURL,
            fileSize: (newFile.size / (1024 * 1024)).toFixed(2) + 'MB',
            fileType: newFile.name.split('.').pop().toUpperCase(),
            teacherId: currentUser.uid,
            teacherName: currentUser.displayName || 'Faculty Member',
            createdAt: serverTimestamp()
          });
          
          showToast("Resource uploaded successfully!", "success");
          setUploading(false);
          setShowModal(false);
          setNewFile(null);
          setResourceMeta({ name: '', category: 'General', classId: '' });
          setProgress(0);
        } catch (err) {
          console.error("Post-upload error:", err);
          showToast("Cloud sync failed. Please try again.", "error");
          setUploading(false);
        }
      }
    );
  };

  const deleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await deleteDoc(doc(db, 'resources', id));
    }
  };

  const filteredResources = resources.filter(res => 
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Resource Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search academic resources..." 
            className="w-full bg-bg-soft border border-border/50 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary transition-all font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto btn btn-primary py-3.5 px-8 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-transform hover:scale-105"
        >
          <Plus size={20} /> Upload Resource
        </button>
      </div>

      {/* Folders/Categories Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.slice(0, 4).map((cat, i) => {
          const count = resources.filter(r => r.category === cat).length;
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <Folder className="text-primary" size={28} />
                </div>
                <span className="text-[10px] font-black text-text-muted bg-bg-soft px-3 py-1 rounded-full">{count} Files</span>
              </div>
              <h4 className="font-bold text-primary">{cat}</h4>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Institutional Materials</p>
            </div>
          );
        })}
      </div>

      {/* Recent Files Table */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
            <div>
              <h3 className="text-xl font-bold text-primary">Academic Library</h3>
              <p className="text-xs text-text-muted mt-1">Manage and share your classroom materials</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-border shadow-sm">
               <Filter size={18} className="text-text-muted" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <th className="px-8 py-4">Resource Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Size / Type</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredResources.map((file) => (
                <tr key={file.id} className="hover:bg-bg-soft/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-bg-soft p-3 rounded-xl group-hover:bg-primary/5 transition-colors">
                        <FileText className="text-primary" size={20} />
                      </div>
                      <span className="text-sm font-bold text-primary">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black px-3 py-1 bg-bg-soft rounded-full text-text-muted uppercase border border-border/50">
                      {file.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-text-muted uppercase">{file.fileType} • {file.fileSize}</p>
                  </td>
                  <td className="px-8 py-6 text-xs text-text-muted font-bold">
                    {file.createdAt?.toDate ? file.createdAt.toDate().toLocaleDateString() : 'Today'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-bg-soft text-text-muted hover:text-primary transition-all"
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => deleteResource(file.id)}
                        className="p-2.5 rounded-xl bg-bg-soft text-text-muted hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center opacity-40 italic">
                    No resources found in your academic library.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowModal(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
                <h3 className="text-xl font-bold text-primary">New Academic Resource</h3>
                <button onClick={() => !uploading && setShowModal(false)} className="p-2 hover:bg-border/30 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-10 space-y-8">
                {uploading ? (
                  <div className="py-12 text-center space-y-6">
                    <div className="relative h-32 w-32 mx-auto">
                       <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle className="text-bg-soft stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                          <circle className="text-primary stroke-current transition-all duration-300" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100}></circle>
                       </svg>
                       <div className="absolute inset-0 flex-center font-black text-primary text-xl">
                          {Math.round(progress)}%
                       </div>
                    </div>
                    <p className="text-sm font-bold text-primary animate-pulse">Uploading to School Cloud...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div 
                        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer relative group ${
                          newFile ? 'border-green-500 bg-green-50/30' : 'border-border/50 hover:border-primary/30 bg-bg-soft/30'
                        }`}
                        onClick={() => document.getElementById('file-input').click()}
                      >
                        <input 
                          id="file-input"
                          type="file" 
                          className="hidden" 
                          onChange={e => setNewFile(e.target.files[0])}
                        />
                        {newFile ? (
                          <div className="space-y-2">
                            <FileCheck className="mx-auto text-green-500" size={48} />
                            <p className="text-sm font-bold text-green-700">{newFile.name}</p>
                            <p className="text-[10px] text-green-600/60 uppercase">Click to change file</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadCloud className="mx-auto text-text-muted group-hover:text-primary transition-colors" size={48} />
                            <p className="text-sm font-bold text-text-muted group-hover:text-primary">Click or Drag to Upload</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest">PDF, DOC, ZIP (Max 10MB)</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Display Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                            placeholder="e.g. Mathematics Week 1 Lesson Plan"
                            value={resourceMeta.name}
                            onChange={e => setResourceMeta({...resourceMeta, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Target Class</label>
                          <select 
                            required
                            className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium appearance-none"
                            value={resourceMeta.classId}
                            onChange={e => setResourceMeta({...resourceMeta, classId: e.target.value})}
                          >
                            <option value="">Select a Class</option>
                            <option value="all">All Classes</option>
                            {assignedClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Category</label>
                          <select 
                            className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium appearance-none"
                            value={resourceMeta.category}
                            onChange={e => setResourceMeta({...resourceMeta, category: e.target.value})}
                          >
                            {categories.map(cat => <option key={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!newFile}
                      className="w-full btn btn-primary py-5 rounded-[2rem] shadow-2xl shadow-primary/30 text-sm font-black uppercase tracking-widest disabled:opacity-30"
                    >
                      Process Upload
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherResources;
