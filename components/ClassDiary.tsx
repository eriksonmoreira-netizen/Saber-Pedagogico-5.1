
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Save, 
  History, 
  Check, 
  X, 
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';
import { store } from '../state/store';
import { ClassLog, Attendance } from '../types';

export const ClassDiary: React.FC = () => {
  // Estado Principal
  const [classes, setClasses] = useState(store.classes);
  const [students, setStudents] = useState(store.students);
  const [logs, setLogs] = useState(store.classLogs);
  const [attendances, setAttendances] = useState(store.attendances);

  // Estado do Formulário
  const [selectedClassId, setSelectedClassId] = useState(store.classes[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [activities, setActivities] = useState('');
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'HISTORY'>('REGISTER');
  
  // Estado local para a pauta do dia (similar ao Attendance.tsx)
  const [localAttendance, setLocalAttendance] = useState<Record<string, 'presente' | 'falta' | 'atraso'>>({});

  useEffect(() => {
    return store.subscribe(() => {
      setClasses(store.classes);
      setStudents(store.students);
      setLogs(store.classLogs);
      setAttendances(store.attendances);
    });
  }, []);

  // Quando mudar a turma, resetar seleção de presença (padrão todos presentes)
  useEffect(() => {
    if (selectedClassId) {
      const classStudents = students.filter(s => s.class_id === selectedClassId);
      const initial: Record<string, 'presente' | 'falta' | 'atraso'> = {};
      classStudents.forEach(s => {
        initial[s.id] = 'presente';
      });
      setLocalAttendance(initial);
    }
  }, [selectedClassId, students]);

  const filteredStudents = students.filter(s => s.class_id === selectedClassId);
  const classLogs = logs
    .filter(l => l.class_id === selectedClassId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (studentId: string, status: 'presente' | 'falta' | 'atraso') => {
    setLocalAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!selectedClassId || !content) {
      alert("Por favor, preencha o conteúdo da aula.");
      return;
    }

    // 1. Salvar o Log da Aula
    const newLog: ClassLog = {
      id: `log-${Date.now()}`,
      class_id: selectedClassId,
      date,
      content,
      activities,
      created_at: new Date().toISOString()
    };
    store.saveClassLog(newLog);

    // 2. Salvar Chamada (Attendance)
    const attendanceRecords: Attendance[] = filteredStudents.map(s => ({
      id: `att-${s.id}-${date}`,
      student_id: s.id,
      class_id: selectedClassId,
      date,
      lesson_number: 1,
      status: localAttendance[s.id] || 'presente',
      justification: undefined
    }));
    
    store.saveAttendances(attendanceRecords);

    alert("Diário de classe registrado com sucesso!");
    setContent('');
    setActivities('');
    setActiveTab('HISTORY');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diário de Classe</h1>
          <p className="text-slate-500 font-medium">Registro integrado de conteúdo e frequência.</p>
        </div>
        
        {/* Toggle Tabs */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
          <button 
            onClick={() => setActiveTab('REGISTER')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'REGISTER' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen className="w-4 h-4" /> Registro
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'HISTORY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History className="w-4 h-4" /> Histórico
          </button>
        </div>
      </div>

      {activeTab === 'REGISTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Conteúdo */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Turma</label>
                  <select 
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data da Aula</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo Ministrado</label>
                <textarea 
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva o que foi ensinado hoje..."
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividades / Observações</label>
                <textarea 
                  rows={2}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Exercícios, trabalhos em grupo, avisos..."
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Chamada Simplificada com Botões */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> Chamada Rápida
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[400px] space-y-3 pr-2">
                {filteredStudents.length > 0 ? filteredStudents.map(student => {
                  const status = localAttendance[student.id];
                  return (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                          {student.name.substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate max-w-[80px]">
                          {student.name.split(' ')[0]}
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleStatusChange(student.id, 'presente')}
                          className={`p-1.5 rounded-lg transition-all ${status === 'presente' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-100 hover:text-emerald-600'}`}
                          title="Presente"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'falta')}
                          className={`p-1.5 rounded-lg transition-all ${status === 'falta' ? 'bg-red-500 text-white shadow-md' : 'text-slate-300 hover:bg-red-100 hover:text-red-600'}`}
                          title="Falta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'atraso')}
                          className={`p-1.5 rounded-lg transition-all ${status === 'atraso' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-300 hover:bg-amber-100 hover:text-amber-600'}`}
                          title="Atraso"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-center text-slate-400 text-sm py-4">Selecione uma turma para carregar a lista.</p>
                )}
              </div>

              <button 
                onClick={handleSave}
                className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-5 h-5" /> Salvar Diário
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm items-center">
             <span className="text-xs font-bold text-slate-400 uppercase">Filtrar Histórico:</span>
             <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 border-none rounded-lg py-1 px-3 text-sm font-bold text-indigo-600 outline-none"
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {classLogs.length > 0 ? classLogs.map((log) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Ícone Central */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-indigo-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Calendar className="w-5 h-5" />
                </div>
                
                {/* Card do Conteúdo */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Registrado
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Conteúdo
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {log.content}
                  </p>
                  {log.activities && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Atividades</p>
                      <p className="text-slate-700 text-xs">{log.activities}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 relative z-10">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Nenhum registro encontrado para esta turma.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
