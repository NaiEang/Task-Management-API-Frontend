import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { Plus, ListTodo, Clock, LayoutDashboard } from 'lucide-react'; // Optional: npm install lucide-react

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await api.post('/tasks', { title, description: 'Created from UI', assignee: 'Me' });
    setTitle('');
    fetchTasks();
  };

  return (
    <div className="pt-28 pb-20 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Workspace</h1>
            <p className="text-slate-700 text-lg mt-2 font-medium">Manage your team tasks and progress.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[120px] text-center">
            <p className="text-slate-500 text-xs font-bold uppercase">Total Tasks</p>
            <p className="text-2xl font-black text-slate-800">{tasks.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
               <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Plus className="w-5 h-5 text-indigo-600" /> New Task
               </h2>
               <form onSubmit={createTask} className="space-y-4">
                <input 
                  id="task-input"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none text-slate-700 font-medium" 
                  placeholder="Task title..."
                />
                <button 
                  id="add-task" 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-slate-400 mb-6 px-2">
              <ListTodo className="w-5 h-5" />
              <span className="font-bold uppercase text-xs tracking-widest">Task List</span>
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <LayoutDashboard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400">No tasks yet.</p>
                </div>
              ) : (
                tasks.map((task: Task) => (
                  <div key={task.id} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Clock className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <span className="task-item text-lg font-bold text-slate-700">{task.title}</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}