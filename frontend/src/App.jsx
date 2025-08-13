
import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, Star, Plus, Edit2, Trash2, Save, X, Settings, AlertCircle, Moon, Sun, Zap, TrendingUp, Target, Crown } from 'lucide-react';
import Footer from './components/Footer';
import axios from 'axios';

const App = () => {
  const [activeRound, setActiveRound] = useState('round1');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [newTeam, setNewTeam] = useState({
    name: '',
    college: '',
    round1: 0,
    round2: 0,
    round3: 0
  });

  // Mock API functions (replace with your actual API calls)
 const API_BASE_URL = 'http://localhost:4000/api/round1';

  const fetchTeams = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/teams`);
      setTeams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams. Please check your backend connection.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async () => {
    if (!newTeam.name.trim() || !newTeam.college.trim()) {
      setError('Team name and college are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, newTeam);
      if (response.status !== 201) throw new Error(`HTTP error! status: ${response.status}`);
      const addedTeam = response.data;
      setTeams(prev => [...prev, addedTeam]);
      setNewTeam({ name: '', college: '', round1: 0, round2: 0, round3: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding team:', error);
      setError('Failed to add team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };

  const updateTeam = async (teamId, updatedData) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/teams/${teamId}`, updatedData);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedTeam = response.data;
      setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team));
      setEditingTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };

  const removeTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/teams/delete/${teamId}`);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      setTeams(prev => prev.filter(team => team._id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
      setError('Failed to delete team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };



  useEffect(() => { fetchTeams(); }, []);

  const getSortedTeams = () => [...teams].sort((a, b) => (b[activeRound] || 0) - (a[activeRound] || 0));

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return (
        <div className="relative">
          <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
          <Crown className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
        </div>
      );
      case 2: return <Medal className="w-8 h-8 text-gray-300 drop-shadow-lg" />;
      case 3: return <Award className="w-8 h-8 text-amber-500 drop-shadow-lg" />;
      default: return (
        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
            : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
        }`}>
          {rank}
        </div>
      );
    }
  };

  const getRankBgColor = (rank) => {
    if (darkMode) {
      switch (rank) {
        case 1: return 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-500/30 shadow-xl shadow-yellow-500/10';
        case 2: return 'bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-400/30 shadow-xl shadow-gray-400/10';
        case 3: return 'bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-500/30 shadow-xl shadow-amber-500/10';
        default: return 'bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300';
      }
    } else {
      switch (rank) {
        case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 shadow-xl shadow-yellow-200/30';
        case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-xl shadow-gray-200/30';
        case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-xl shadow-amber-200/30';
        default: return 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-200/20 transition-all duration-300';
      }
    }
  };

  const roundTitles = { round1: 'Round 1', round2: 'Round 2', round3: 'Round 3' };

  const handleEditSubmit = (e, teamId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      college: formData.get('college'),
      round1: Number(formData.get('round1')) || 0,
      round2: Number(formData.get('round2')) || 0,
      round3: Number(formData.get('round3')) || 0
    };
    updateTeam(teamId, updatedData);
  };

  const sortedTeams = getSortedTeams();
  const totalTeams = teams.length;
  const topScore = sortedTeams.length ? sortedTeams[0][activeRound] || 0 : 0;
  const averageScore = teams.length ? Math.round(teams.reduce((sum, team) => sum + (team[activeRound] || 0), 0) / teams.length) : 0;

  const themeClasses = darkMode ? 'dark bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          darkMode ? 'bg-purple-500' : 'bg-blue-400'
        } animate-pulse`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          darkMode ? 'bg-blue-500' : 'bg-purple-400'
        } animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'
      } text-white shadow-2xl`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    NSS Competition Leaderboard
                  </h1>
                  <p className="text-blue-200 text-lg">National Service Scheme - Not me but You</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={fetchTeams} 
                disabled={loading} 
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-all duration-300 ${
                  showAdmin 
                    ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg' 
                    : 'bg-purple-600/80 hover:bg-purple-700 text-white border border-purple-500/50 backdrop-blur-sm'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{showAdmin ? 'Exit Admin' : 'Admin Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 mb-6 border shadow-lg ${
            darkMode 
              ? 'bg-red-900/20 border-red-500/30 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError('')} 
              className={`hover:bg-red-500/20 rounded-lg p-1 transition-colors ${
                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSecondary}`}>Total Teams</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{totalTeams}</p>
              </div>
              <Users className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <div className={`p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSecondary}`}>Top Score</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{topScore}</p>
              </div>
              <Target className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <div className={`p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSecondary}`}>Average Score</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{averageScore}</p>
              </div>
              <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          <div className={`p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSecondary}`}>Current Round</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{roundTitles[activeRound]}</p>
              </div>
              <Zap className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>
        </div>

        {/* Round Selection */}
        <div className={`p-6 rounded-xl shadow-xl border mb-8 ${cardBg}`}>
          <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Competition Rounds</h2>
          <div className="flex gap-4">
            {Object.entries(roundTitles).map(([key, title]) => (
              <button
                key={key}
                onClick={() => setActiveRound(key)}
                className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeRound === key 
                    ? darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Controls */}
        {showAdmin && (
          <div className={`p-6 rounded-xl shadow-xl border mb-8 ${cardBg}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Admin Controls</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={loading}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                  darkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Team</span>
              </button>
            </div>

            {showAddForm && (
              <div className="border-t border-gray-600/20 pt-6 space-y-6">
                <h4 className={`text-lg font-semibold ${textPrimary}`}>Add New Team</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { key: 'name', placeholder: 'Team Name', type: 'text' },
                    { key: 'college', placeholder: 'College', type: 'text' },
                    { key: 'round1', placeholder: 'Round 1 Points', type: 'number' },
                    { key: 'round2', placeholder: 'Round 2 Points', type: 'number' },
                    { key: 'round3', placeholder: 'Round 3 Points', type: 'number' }
                  ].map(field => (
                    <input
                      key={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={newTeam[field.key]}
                      onChange={(e) => setNewTeam({
                        ...newTeam, 
                        [field.key]: field.type === 'number' ? +e.target.value || 0 : e.target.value
                      })}
                      className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={addTeam} 
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                    }`}
                  >
                    {loading ? 'Adding...' : 'Add Team'}
                  </button>
                  <button 
                    onClick={() => { 
                      setShowAddForm(false); 
                      setNewTeam({ name: '', college: '', round1: 0, round2: 0, round3: 0 }); 
                    }}
                    className={`px-6 py-3 rounded-xl border font-medium transition-all duration-300 ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className={`rounded-xl shadow-2xl border overflow-hidden ${cardBg}`}>
          <div className={`px-6 py-6 border-b ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <h2 className={`text-3xl font-bold ${textPrimary}`}>{roundTitles[activeRound]} Leaderboard</h2>
            <p className={`${textSecondary} mt-1`}>Current standings and team performance</p>
          </div>

          <div className="p-6">
            {loading && teams.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : sortedTeams.length === 0 ? (
              <div className={`text-center py-12 ${textSecondary}`}>
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No teams found</p>
                {showAdmin && <p>Add some teams to get started!</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedTeams.map((team, index) => {
                  const rank = index + 1;
                  const isEditing = editingTeam === team.id;

                  return (
                    <div 
                      key={team.id} 
                      className={`p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 ${getRankBgColor(rank)}`}
                    >
                      {isEditing ? (
                        <form onSubmit={(e) => handleEditSubmit(e, team._id)} className="space-y-4">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                              <input 
                                name="name" 
                                defaultValue={team.name} 
                                required 
                                className={`px-4 py-3 rounded-xl border ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`} 
                              />
                              <input 
                                name="college" 
                                defaultValue={team.college} 
                                required 
                                className={`px-4 py-3 rounded-xl border ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`} 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {['round1', 'round2', 'round3'].map(round => (
                              <input 
                                key={round}
                                name={round} 
                                type="number" 
                                defaultValue={team[round] || 0} 
                                className={`px-4 py-3 rounded-xl border ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`} 
                              />
                            ))}
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button 
                              type="submit" 
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center space-x-2 transition-all duration-300"
                            >
                              <Save className="w-4 h-4" />
                              <span>{loading ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setEditingTeam(null)}
                              className={`px-4 py-2 rounded-xl border flex items-center space-x-2 transition-all duration-300 ${
                                darkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                            <div className="space-y-2">
                              <h3 className={`text-xl font-bold ${textPrimary}`}>{team.name}</h3>
                              <p className={`${textSecondary} font-medium`}>{team.college}</p>
                              <div className="flex space-x-6 text-sm">
                                {['round1', 'round2', 'round3'].map(round => (
                                  <span 
                                    key={round}
                                    className={`px-3 py-1 rounded-lg ${
                                      round === activeRound 
                                        ? darkMode 
                                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                                        : darkMode 
                                          ? 'bg-gray-700/50 text-gray-400' 
                                          : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {round.replace('round', 'R')}: {team[round] || 0}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <div className={`text-4xl font-bold ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                {team[activeRound] || 0}
                              </div>
                              <div className={`text-sm ${textSecondary}`}>points</div>
                            </div>
                            {showAdmin && (
                              <div className="flex flex-col space-y-2">
                                <button 
                                  onClick={() => setEditingTeam(team.id)} 
                                  disabled={loading}
                                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                                    darkMode 
                                      ? 'text-blue-400 hover:bg-blue-600/20 border border-blue-500/30' 
                                      : 'text-blue-600 hover:bg-blue-100 border border-blue-200'
                                  }`}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => removeTeam(team._id)} 
                                  disabled={loading}
                                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                                    darkMode 
                                      ? 'text-red-400 hover:bg-red-600/20 border border-red-500/30' 
                                      : 'text-red-600 hover:bg-red-100 border border-red-200'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;