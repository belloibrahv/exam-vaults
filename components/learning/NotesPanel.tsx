'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Palette,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  highlight?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  lesson: {
    title: string;
    slug: string;
  };
}

interface NotesPanelProps {
  lessonId: string;
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesPanel({ lessonId, lessonTitle, isOpen, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const colors = [
    { name: 'yellow', class: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-800' },
    { name: 'blue', class: 'bg-blue-100 border-blue-300', text: 'text-blue-800' },
    { name: 'green', class: 'bg-green-100 border-green-300', text: 'text-green-800' },
    { name: 'pink', class: 'bg-pink-100 border-pink-300', text: 'text-pink-800' },
    { name: 'purple', class: 'bg-purple-100 border-purple-300', text: 'text-purple-800' },
  ];

  const getColorClasses = (color: string) => {
    const colorConfig = colors.find(c => c.name === color) || colors[0];
    return colorConfig;
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/learning/notes?lessonId=${lessonId}`);
      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch('/api/learning/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          content: newNote,
          color: selectedColor,
        }),
      });

      if (response.ok) {
        const note = await response.json();
        setNotes(prev => [note, ...prev]);
        setNewNote('');
        setSelectedColor('yellow');
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/learning/notes?id=${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prev => prev.map(note => note.id === noteId ? updatedNote : note));
        setEditingNote(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/learning/notes?id=${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditContent('');
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, lessonId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <StickyNote className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Lesson Notes</h3>
                  <p className="text-sm text-gray-600">{lessonTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* New Note Form */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="space-y-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note about this lesson..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                rows={3}
              />
              
              {/* Color Picker */}
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-500" />
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border-2 ${color.class} ${
                        selectedColor === color.name ? 'border-gray-400' : 'border-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={createNote}
                disabled={!newNote.trim()}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notes yet</p>
                <p className="text-sm">Add your first note to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => {
                  const colorConfig = getColorClasses(note.color);
                  const isEditing = editingNote === note.id;

                  return (
                    <motion.div
                      key={note.id}
                      layout
                      className={`p-4 rounded-lg border-l-4 ${colorConfig.class}`}
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateNote(note.id)}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`${colorConfig.text} mb-2`}>
                            <p className="whitespace-pre-wrap">{note.content}</p>
                          </div>
                          
                          {note.highlight && (
                            <div className="mb-2 p-2 bg-white/50 rounded text-sm italic">
                              &ldquo;{note.highlight}&rdquo;
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => startEditing(note)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Edit note"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Delete note"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}