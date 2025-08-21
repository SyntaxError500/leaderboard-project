import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, Star, Plus, Edit2, Trash2, Save, X, Settings, AlertCircle, Moon, Sun, Zap, TrendingUp, Target, Crown } from 'lucide-react';
import axios from 'axios';

const Footer = () => (
  <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
    <p>&copy; 2024 NSS Competition Leaderboard. All rights reserved.</p>
  </footer>
);

const App = () => {
  const [activeRound, setActiveRound] = useState('round1');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teams, setTeams] = useState([
   
  ]);
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
 const API_BASE_URL = 'https://leaderboard-project-rose.vercel.app/api/round1';

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
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 drop-shadow-lg" />
          <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 absolute -top-1 -right-1" />
        </div>
      );
      case 2: return <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 drop-shadow-lg" />;
      case 3: return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 drop-shadow-lg" />;
      default: return (
        <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-xs sm:text-sm shadow-lg ${
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
        <div className={`absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-20 blur-3xl ${
          darkMode ? 'bg-purple-500' : 'bg-blue-400'
        } animate-pulse`}></div>
        <div className={`absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-20 blur-3xl ${
          darkMode ? 'bg-blue-500' : 'bg-purple-400'
        } animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'
      } text-white shadow-2xl`}>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded"><img src="/nss.jpeg" alt=""  className='h-8 w-8'/></div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    NSS Competition Leaderboard
                  </h1>
                  <p className="text-blue-200 text-sm sm:text-lg">National Service Scheme - Not me but You</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button 
                onClick={fetchTeams} 
                disabled={loading} 
                className="px-3 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 font-medium transition-all duration-300 text-sm sm:text-base ${
                  showAdmin 
                    ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg' 
                    : 'bg-purple-600/80 hover:bg-purple-700 text-white border border-purple-500/50 backdrop-blur-sm'
                }`}
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{showAdmin ? 'Exit Admin' : 'Admin Mode'}</span>
                <span className="sm:hidden">{showAdmin ? 'Exit' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 mb-6 border shadow-lg ${
            darkMode 
              ? 'bg-red-900/20 border-red-500/30 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="flex-1 text-sm sm:text-base">{error}</span>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className={`p-4 sm:p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>Total Teams</p>
                <p className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{totalTeams}</p>
              </div>
              <Users className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <div className={`p-4 sm:p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>Top Score</p>
                <p className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{topScore}</p>
              </div>
              <Target className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <div className={`p-4 sm:p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>Average Score</p>
                <p className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{averageScore}</p>
              </div>
              <TrendingUp className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          {/* <div className={`p-4 sm:p-6 rounded-xl shadow-xl border transition-all duration-300 hover:scale-105 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>Current Round</p>
                <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{roundTitles[activeRound]}</p>
              </div>
              <Zap className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div> */}
        </div>


        {/* Admin Controls */}
        {showAdmin && (
          <div className={`p-4 sm:p-6 rounded-xl shadow-xl border mb-6 sm:mb-8 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>Admin Controls</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={loading}
                className={`w-full sm:w-auto px-4 py-3 sm:px-6 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all duration-300 transform hover:scale-105 ${
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
                <h4 className={`text-base sm:text-lg font-semibold ${textPrimary}`}>Add New Team</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={addTeam} 
                    disabled={loading}
                    className={`px-4 py-3 sm:px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
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
                    className={`px-4 py-3 sm:px-6 rounded-xl border font-medium transition-all duration-300 ${
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
       {/* Leaderboard */}
<div className={`rounded-xl shadow-2xl border overflow-hidden ${cardBg}`}>
  <div className={`px-4 py-4 sm:px-6 sm:py-6 border-b ${
    darkMode 
      ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
  }`}>
    <h2 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>{roundTitles[activeRound]} Leaderboard</h2>
    <p className={`${textSecondary} mt-1 text-sm sm:text-base`}>Current standings and team performance</p>
  </div>

  <div className="p-4 sm:p-6">
    {loading && teams.length === 0 ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600"></div>
      </div>
    ) : sortedTeams.length === 0 ? (
      <div className={`text-center py-12 ${textSecondary}`}>
        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg sm:text-xl">No teams found</p>
        {showAdmin && <p className="text-sm sm:text-base">Add some teams to get started!</p>}
      </div>
    ) : (
      <div className="space-y-2 sm:space-y-3">
        {sortedTeams.map((team, index) => {
          const rank = index + 1;
          const isEditing = editingTeam === team.id;

          return (
            <div 
              key={team.id} 
              className={`p-3 sm:p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 ${getRankBgColor(rank)}`}
            >
              {isEditing ? (
                <form onSubmit={(e) => handleEditSubmit(e, team._id)} className="space-y-3">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0 mt-1">{getRankIcon(rank)}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
                      <input 
                        name="name" 
                        defaultValue={team.name} 
                        required 
                        placeholder="Team Name"
                        className={`px-3 py-2 rounded-xl border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`} 
                      />
                      <input 
                        name="college" 
                        defaultValue={team.college} 
                        required 
                        placeholder="College"
                        className={`px-3 py-2 rounded-xl border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['round1', 'round2', 'round3'].map(round => (
                      <input 
                        key={round}
                        name={round} 
                        type="number" 
                        defaultValue={team[round] || 0} 
                        placeholder={`${round.replace('round', 'Round ')} Points`}
                        className={`px-3 py-2 rounded-xl border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingTeam(null)}
                      className={`px-3 py-2 rounded-xl border flex items-center justify-center space-x-2 transition-all duration-300 text-sm ${
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-grow">
                    <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                    <div className="min-w-0 flex-grow">
                      <h3 className={`text-base sm:text-lg font-bold ${textPrimary} truncate`}>{team.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 sm:space-x-4">
                    <div className="text-center sm:text-right">
                      <div className={`text-xl sm:text-2xl font-bold ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {team[activeRound] || 0}
                      </div>
                      <div className={`text-xs ${textSecondary}`}>points</div>
                    </div>
                    {showAdmin && (
                      <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-1">
                        <button 
                          onClick={() => setEditingTeam(team.id)} 
                          disabled={loading}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                            darkMode 
                              ? 'text-blue-400 hover:bg-blue-600/20 border border-blue-500/30' 
                              : 'text-blue-600 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => removeTeam(team._id)} 
                          disabled={loading}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                            darkMode 
                              ? 'text-red-400 hover:bg-red-600/20 border border-red-500/30' 
                              : 'text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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